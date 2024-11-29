#include "SensorManager.h"
#include "MQTTManager.h"
#include "LEDManager.h"
#include "secrets.h"
#include "SerialLogger.h"
#include <ArduinoJson.h>

// Pin definitions
#define LED_PIN 2
#define DHTPIN 4
#define MQ8_PIN 34
#define RX_PIN 16
#define TX_PIN 17

// MQTT Topics
const char* COMMAND_TOPIC = "/home/sensors/command";
const char* STATUS_TOPIC = "/home/sensors/status";
const char* LOG_TOPIC = "/home/sensors/logs";

// Create managers
SensorManager sensors(DHTPIN, MQ8_PIN, RX_PIN, TX_PIN);
WiFiManager wifiManager;
MQTTManager mqtt(wifiManager, "/home/sensors");
LEDManager led(LED_PIN);
SerialLogger logger(mqtt, LOG_TOPIC);

// Device state
bool deviceEnabled = true;
unsigned long statusInterval = 30000; // Status update every 30 seconds
unsigned long lastStatusUpdate = 0;
bool loggingEnabled = true;

void handleCommand(const char* payload) {
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, payload);
    
    if (error) {
        logger.println("Failed to parse command");
        return;
    }
    
    if (doc.containsKey("enable")) {
        deviceEnabled = doc["enable"].as<bool>();
    }
    
    if (doc.containsKey("interval")) {
        statusInterval = doc["interval"].as<unsigned long>() * 1000; // Convert to milliseconds
    }
    
    if (doc.containsKey("led")) {
        int blinkCount = doc["led"].as<int>();
        led.blink(blinkCount);
    }
    
    if (doc.containsKey("logging")) {
        loggingEnabled = doc["logging"].as<bool>();
        logger.println(loggingEnabled ? "Logging enabled" : "Logging disabled");
    }
}

void publishStatus() {
    StaticJsonDocument<200> doc;
    doc["enabled"] = deviceEnabled;
    doc["interval"] = statusInterval / 1000;
    doc["wifi_strength"] = WiFi.RSSI();
    doc["uptime"] = millis() / 1000;
    
    char status[200];
    serializeJson(doc, status);
    mqtt.publish(STATUS_TOPIC, status);
}

void setup() {
    Serial.begin(115200);
    while (!Serial) delay(10);
    
    // Initialize WiFiManager
    wifiManager.addEnterpriseNetwork(0, ssid1, password1, identity1, mqtt_server1);
    wifiManager.addRegularNetwork(1, ssid2, password2, mqtt_server2);
    
    if (!wifiManager.connect()) {
        logger.println("Initial WiFi connection failed");
    }
    
    if (!sensors.begin()) {
        logger.println("Failed to initialize sensors!");
        while(1) delay(1000);
    }
    
    led.begin();
    
    // Subscribe to command topic
    mqtt.subscribe(COMMAND_TOPIC, handleCommand);
    
    logger.println("Setup complete!");
}

void loop() {
    if (!wifiManager.checkConnection()) {
        logger.println("Attempting to reconnect WiFi...");
        if (!wifiManager.connect()) {
            delay(5000);
            return;
        }
    }

    mqtt.loop();
    if (!mqtt.isConnected()) {
        logger.println("Attempting to reconnect MQTT...");
        if (!mqtt.connect()) {
            delay(5000);
            return;
        }
    }

    if (wifiManager.isWiFiConnected() && mqtt.isConnected()) {
        // Publish status updates periodically
        if (millis() - lastStatusUpdate >= statusInterval) {
            publishStatus();
            lastStatusUpdate = millis();
        }
        
        // Only read and publish sensor data if device is enabled
        if (deviceEnabled) {
            SensorData data = sensors.readSensors();
            sensors.printReadings(data);
            
            if (mqtt.publish(data)) {
                led.blink(1);  // Success
            } else {
                led.blink(3);  // Failure
            }
        }
        
        delay(2000);
    }
    
    led.update();
}
