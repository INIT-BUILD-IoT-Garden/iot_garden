#include <Wire.h>
#include <Arduino.h>
#include "Adafruit_seesaw.h"
#include "DHT.h"
#include "Adafruit_CCS811.h"
#include "DFRobot_C4001.h"

#define DHTPIN 4     // Define the pin you connected the DHT11 data pin to
#define DHTTYPE DHT11   // DHT11 sensor type
#define MQ8_PIN 34  // Analog pin for MQ-8 sensor
#define CCS811_WAKE 5  // Optional: Connect WAKE pin to GPIO5 or connect directly to GND
#define C4001_I2C_ADDR 0x2A  // Default I2C address for C4001

// Add UART pins definition
#define RX_PIN 16  // GPIO16
#define TX_PIN 17  // GPIO17

Adafruit_seesaw ss;
DHT dht(DHTPIN, DHTTYPE);
Adafruit_CCS811 ccs;
DFRobot_C4001_UART radar(&Serial2, 9600, RX_PIN, TX_PIN);  // Use UART instead of I2C version

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);
  
  Serial.println("Soil Sensor, DHT11 Temperature and Humidity Sensor, MQ-8 Hydrogen Gas Sensor, and CCS811 Air Quality Sensor test!");
  
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
  
  // Initialize C4001 mmWave sensor with better debug
  int retries = 0;
  while (!radar.begin() && retries < 5) {
    Serial.println("C4001 Initialization failed!");
    Serial.println("Check UART wiring (TX->RX, RX->TX) and power...");
    Serial.printf("Retry %d/5\n", retries + 1);
    delay(1000);
    retries++;
  }

  if (retries >= 5) {
    Serial.println("Failed to initialize radar after 5 attempts");
    Serial.println("1. Check power supply is 3.3V");
    Serial.println("2. Verify TX->RX, RX->TX connections");
    Serial.println("3. Ensure GND is connected");
  } else {
    Serial.println("C4001 Initialized successfully!");
  }
  
  // Configure sensor mode (Speed detection mode)
  radar.setSensorMode(eSpeedMode);
  
  // Set detection thresholds (min distance, max distance, threshold)
  radar.setDetectThres(30, 2500, 10);  // 0.3m to 25m range
  
  // Enable fretting detection
  radar.setFrettingDetection(eON);
}

void loop() {
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
    float speed = radar.getTargetSpeed();
    Serial.print("Target Speed: ");
    Serial.print(speed);
    Serial.println(" m/s");
    
    // Get target distance (in meters)
    float distance = radar.getTargetRange();
    Serial.print("Target Distance: ");
    Serial.print(distance);
    Serial.println(" m");
    
    // Get target energy level (signal strength)
    uint16_t energy = radar.getTargetEnergy();
    Serial.print("Target Energy: ");
    Serial.println(energy);
  }
  
  delay(2000);  // Wait 2 seconds between measurements
}