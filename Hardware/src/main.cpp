#include "SensorManager.h"
#include "MQTTManager.h"
#include "LEDManager.h"
#include "secrets.h"

// Pin definitions
#define LED_PIN 2
#define DHTPIN 4
#define MQ8_PIN 34
#define RX_PIN 16
#define TX_PIN 17

// Create managers
SensorManager sensors(DHTPIN, MQ8_PIN, RX_PIN, TX_PIN);
WiFiManager wifiManager;
MQTTManager mqtt(wifiManager, "/home/sensors");
LEDManager led(LED_PIN);

void setup() {
    Serial.begin(115200);
    while (!Serial) delay(10);
    
    // Initialize WiFiManager
    wifiManager.addEnterpriseNetwork(0, ssid1, password1, identity1, mqtt_server1);
    wifiManager.addRegularNetwork(1, ssid2, password2, mqtt_server2);
    
    if (!wifiManager.connect()) {
        Serial.println("Initial WiFi connection failed");
    }
    
    if (!sensors.begin()) {
        Serial.println("Failed to initialize sensors!");
        while(1) delay(1000);
    }
    
    led.begin();
}

void loop() {
    if (!wifiManager.checkConnection()) {
        Serial.println("Attempting to reconnect WiFi...");
        if (!wifiManager.connect()) {
            delay(5000);
            return;
        }
    }

    mqtt.loop();
    if (!mqtt.isConnected()) {
        Serial.println("Attempting to reconnect MQTT...");
        if (!mqtt.connect()) {
            delay(5000);
            return;
        }
    }

    if (wifiManager.isWiFiConnected() && mqtt.isConnected()) {
        SensorData data = sensors.readSensors();
        sensors.printReadings(data);
        
        if (mqtt.publish(data)) {
            led.blink(1);  // Success
        } else {
            led.blink(3);  // Failure
        }
        
        delay(2000);
    }
    
    led.update();
}
