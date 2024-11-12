#include <Wire.h>
#include <Arduino.h>
#include "Adafruit_seesaw.h"
#include "DHT.h"
#include "Adafruit_CCS811.h"
#include "DFRobot_C4001.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include <time.h>
#include "WiFiManager.h"

#define LED_PIN 2  // Built-in LED on ESP32 board

#define DHTPIN 4     // Define the pin you connected the DHT11 data pin to
#define DHTTYPE DHT11   // DHT11 sensor type
#define MQ8_PIN 34  // Analog pin for MQ-8 sensor
#define CCS811_WAKE 5  // Optional: Connect WAKE pin to GPIO5 or connect directly to GND
#define C4001_I2C_ADDR 0x2A  // Default I2C address for C4001

// Add UART pins definition
#define RX_PIN 16  // GPIO16
#define TX_PIN 17  // GPIO17

// Add MQTT configuration
const char* mqtt_server = "172.20.10.8";  // Your MQTT broker IP
const int mqtt_port = 1883;
const char* mqtt_topic = "/home/sensors";

// Create MQTT client
WiFiClient espClient;
PubSubClient client(espClient);

// Create WiFiManager instance
WiFiManager wifiManager;

// Add MQTT connection function
bool connectToMQTT() {
    if (!client.connected()) {
        Serial.println("Connecting to MQTT...");
        
        // Create a random client ID
        String clientId = "ESP32Client-";
        clientId += String(random(0xffff), HEX);
        
        if (client.connect(clientId.c_str())) {
            Serial.println("MQTT connected");
            return true;
        } else {
            Serial.print("MQTT connection failed, rc=");
            Serial.print(client.state());
            return false;
        }
    }
    return true;
}

Adafruit_seesaw ss;
DHT dht(DHTPIN, DHTTYPE);
Adafruit_CCS811 ccs;
DFRobot_C4001_UART radar(&Serial2, 9600, RX_PIN, TX_PIN);  // Use UART instead of I2C version

// Add these globals at the top of your file
unsigned long lastLedToggle = 0;
bool ledState = false;
int ledBlinkCount = 0;
const int LED_BLINK_INTERVAL = 100;  // ms

// Add this function to handle LED blinking
void handleLedFeedback() {
    if (ledBlinkCount > 0) {
        unsigned long currentMillis = millis();
        if (currentMillis - lastLedToggle >= LED_BLINK_INTERVAL) {
            lastLedToggle = currentMillis;
            ledState = !ledState;
            digitalWrite(LED_PIN, ledState);
            
            if (!ledState) {  // Just turned LED off
                ledBlinkCount--;
                if (ledBlinkCount == 0) {
                    digitalWrite(LED_PIN, LOW);  // Ensure LED is off
                }
            }
        }
    }
}

// Replace sendSensorData function
void sendSensorData(float soilTemp, uint16_t soilMoisture, float airTemp, float humidity, 
                   int h2Value, float h2Voltage, uint16_t co2, uint16_t tvoc,
                   uint8_t targetCount, float speed, float distance, uint16_t energy) {
    
    // Check WiFi connection
    if (!wifiManager.checkConnection()) {
        Serial.println("WiFi not connected. Attempting to reconnect...");
        if (!wifiManager.connect()) {
            Serial.println("WiFi reconnection failed. Data not sent.");
            return;
        }
    }

    if (!connectToMQTT()) {
        Serial.println("MQTT not connected. Data not sent.");
        return;
    }

    // Create JSON payload
    String jsonPayload = "{";
    jsonPayload += "\"soil_temperature\":" + String(soilTemp) + ",";
    jsonPayload += "\"soil_moisture\":" + String(soilMoisture) + ",";
    jsonPayload += "\"air_temperature\":" + String(airTemp) + ",";
    jsonPayload += "\"humidity\":" + String(humidity) + ",";
    jsonPayload += "\"hydrogen_raw\":" + String(h2Value) + ",";
    jsonPayload += "\"hydrogen_voltage\":" + String(h2Voltage) + ",";
    jsonPayload += "\"co2\":" + String(co2) + ",";
    jsonPayload += "\"tvoc\":" + String(tvoc) + ",";
    jsonPayload += "\"target_count\":" + String(targetCount) + ",";
    jsonPayload += "\"target_speed\":" + String(speed) + ",";
    jsonPayload += "\"target_distance\":" + String(distance) + ",";
    jsonPayload += "\"target_energy\":" + String(energy);
    jsonPayload += "}";

    // Debug print
    Serial.println("Sending data via MQTT:");
    Serial.println(jsonPayload);

    // Publish to MQTT
    if (client.publish(mqtt_topic, jsonPayload.c_str())) {
        Serial.println("Data sent successfully");
        ledBlinkCount = 1;  // One blink for success
    } else {
        Serial.println("Failed to send data");
        ledBlinkCount = 3;  // Three blinks for failure
    }
    lastLedToggle = millis();
    ledState = true;
    digitalWrite(LED_PIN, HIGH);
}

void setupTime() {
    configTime(0, 0, "pool.ntp.org", "time.nist.gov");
    Serial.println("Waiting for time sync...");
    while (time(nullptr) < 1000000000) {
        delay(100);
    }
    Serial.println("Time synchronized!");
}

void setup() {
    Serial.begin(115200);
    while (!Serial) delay(10);
    
    // Configure WiFi networks
    wifiManager.addNetwork(0, "SSID1", "password1");
    wifiManager.addNetwork(1, "SSID2", "password2");
    
    // Connect to WiFi
    Serial.println("Connecting to WiFi...");
    while (!wifiManager.connect()) {
        delay(1000);
        Serial.println("Retrying WiFi connection...");
    }
    
    // Initialize I2C
    Wire.begin(22, 21);
    
    // Initialize UART for radar
    Serial2.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);
    
    // Initialize DHT11
    dht.begin();
    
    // Initialize CCS811
    if(!ccs.begin()) {
        Serial.println("Failed to start CCS811! Please check your wiring.");
        while(1);
    }
    
    // Wait for the sensor to be ready
    while(!ccs.available());
    
    // Initialize soil sensor
    if (!ss.begin(0x36)) {
        Serial.println("ERROR! seesaw not found");
        Serial.println("Check your connections and verify the address");
        while(1) {
            delay(1000);
            Serial.println("Retrying...");
            if (ss.begin(0x36)) {
                Serial.println("seesaw found!");
                break;
            }
        }
    } else {
        Serial.print("seesaw started! version: ");
        Serial.println(ss.getVersion(), HEX);
    }
    
    // Setup MQTT
    client.setServer(mqtt_server, mqtt_port);
    
    // Setup LED
    pinMode(LED_PIN, OUTPUT);
    digitalWrite(LED_PIN, LOW);
    
    // Setup time
    setupTime();
}

void loop() {
    // Check WiFi connection at the start of loop
    if (!wifiManager.checkConnection()) {
        Serial.println("Attempting to reconnect WiFi...");
        if (!wifiManager.connect()) {
            delay(5000);  // Wait before next loop iteration
            return;
        }
    }

    // Add MQTT loop at start
    if (!client.connected()) {
        connectToMQTT();
    }
    client.loop();

    // Initialize radar variables with default values
    float speed = 0;
    float distance = 0;
    uint16_t energy = 0;

    // Read soil sensor
    float soilTemp = ss.getTemp();
    uint16_t capread = ss.touchRead(0);
    
    // Read DHT11
    float humidity = dht.readHumidity();
    float airTemp = dht.readTemperature();

    // Check if DHT11 reading failed
    if (isnan(humidity) || isnan(airTemp)) {
        Serial.println("Failed to read from DHT sensor!");
    } else {
        Serial.println("\n----- DHT11 Readings -----");
        Serial.print("Air Temperature: "); Serial.print(airTemp); Serial.println("°C");
        Serial.print("Humidity: "); Serial.print(humidity); Serial.println("%");
    }

    Serial.println("\n----- Soil Sensor Readings -----");
    Serial.print("Soil Temperature: "); Serial.print(soilTemp); Serial.println("°C");
    Serial.print("Soil Moisture: "); Serial.println(capread);
    
    // Read MQ-8 sensor
    int h2Value = analogRead(MQ8_PIN);
    float h2Voltage = h2Value * (5.0 / 4095.0); // Convert to voltage (5V reference)
    // float h2Voltage = h2Value * (3.3 / 4095.0); // Convert to voltage (ESP32 has 12-bit ADC)
    
    Serial.println("\n----- MQ-8 Hydrogen Sensor Readings -----");
    Serial.print("H2 Raw Value: "); Serial.println(h2Value);
    Serial.print("H2 Voltage: "); Serial.print(h2Voltage); Serial.println("V");
    
    // Read CCS811
    if(ccs.available()) {
        if(!ccs.readData()) {
            Serial.println("\n----- CCS811 Air Quality Readings -----");
            Serial.print("CO2: ");
            Serial.print(ccs.geteCO2());
            Serial.println(" ppm");
            
            Serial.print("TVOC: ");
            Serial.print(ccs.getTVOC());
            Serial.println(" ppb");
        } else {
            Serial.println("ERROR reading CCS811 data");
        }
    }
    
    Serial.println("\n----- C4001 mmWave Sensor Readings -----");
    
    // Get number of detected targets
    uint8_t targetCount = radar.getTargetNumber();
    Serial.print("Target Count: "); 
    Serial.println(targetCount);
    
    if (targetCount > 0) {
        // Get target speed (-7 to +7 m/s, negative = moving away)
        speed = radar.getTargetSpeed();
        Serial.print("Target Speed: ");
        Serial.print(speed);
        Serial.println(" m/s");
        
        // Get target distance (in meters)
        distance = radar.getTargetRange();
        Serial.print("Target Distance: ");
        Serial.print(distance);
        Serial.println(" m");
        
        // Get target energy level (signal strength)
        energy = radar.getTargetEnergy();
        Serial.print("Target Energy: ");
        Serial.println(energy);
    }
    
    // Add data sending at the end of loop()
    sendSensorData(soilTemp, capread, airTemp, humidity,
                  h2Value, h2Voltage, ccs.geteCO2(), ccs.getTVOC(),
                  targetCount, speed, distance, energy);
    
    delay(2000);  // Wait 2 seconds between measurements

    handleLedFeedback();  // Handle LED blinking
}