#include "MQTTManager.h"

MQTTManager::MQTTManager(WiFiManager& wifiMgr, const char* topic, int port)
    : client(espClient)
    , wifiManager(wifiMgr)
    , mqtt_topic(topic)
    , mqtt_port(port)
{
}

bool MQTTManager::connect() {
    if (!client.connected()) {
        Serial.println("Connecting to MQTT...");
        
        // Get the appropriate MQTT server based on current network
        const char* mqtt_server = (WiFi.SSID() == String(ssid1)) ? mqtt_server1 : mqtt_server2;
        
        // Set server every time before connecting
        client.setServer(mqtt_server, mqtt_port);
        
        Serial.printf("MQTT Server: %s:%d\n", mqtt_server, mqtt_port);
        
        // Create a random client ID
        String clientId = "ESP32Client-";
        clientId += String(random(0xffff), HEX);
        
        // Try to connect with more options
        if (client.connect(clientId.c_str(), 
                          nullptr,    // username
                          nullptr,    // password
                          "/home/sensors/status",  // will topic
                          0,         // will qos
                          true,      // will retain
                          "offline", // will message
                          true      // clean session
                          )) {
            Serial.println("MQTT connected");
            client.publish("/home/sensors/status", "online", true);
            return true;
        }
        
        Serial.print("MQTT connection failed, rc=");
        Serial.println(client.state());
        return false;
    }
    return true;
}

bool MQTTManager::publish(const SensorData& data) {
    String jsonPayload = "{";
    jsonPayload += "\"soil_temperature\":" + String(data.soilTemp) + ",";
    jsonPayload += "\"soil_moisture\":" + String(data.soilMoisture) + ",";
    jsonPayload += "\"air_temperature\":" + String(data.airTemp) + ",";
    jsonPayload += "\"humidity\":" + String(data.humidity) + ",";
    jsonPayload += "\"hydrogen_raw\":" + String(data.h2Value) + ",";
    jsonPayload += "\"hydrogen_voltage\":" + String(data.h2Voltage) + ",";
    jsonPayload += "\"co2\":" + String(data.co2) + ",";
    jsonPayload += "\"tvoc\":" + String(data.tvoc) + ",";
    jsonPayload += "\"target_count\":" + String(data.targetCount) + ",";
    jsonPayload += "\"target_speed\":" + String(data.speed) + ",";
    jsonPayload += "\"target_distance\":" + String(data.distance) + ",";
    jsonPayload += "\"target_energy\":" + String(data.energy);
    jsonPayload += "}";

    bool success = client.publish(mqtt_topic, jsonPayload.c_str(), true);
    if (success) {
        Serial.println("MQTT message published successfully");
        Serial.printf("Topic: %s\n", mqtt_topic);
        Serial.printf("Payload: %s\n", jsonPayload.c_str());
    } else {
        Serial.println("Failed to publish MQTT message");
    }
    
    return success;
}

void MQTTManager::loop() {
    client.loop();
} 