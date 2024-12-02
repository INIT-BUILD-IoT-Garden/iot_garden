#include "MQTTManager.h"

MQTTManager::MQTTManager(WiFiManager& wifiMgr, const char* topic, int port)
    : client(espClient)
    , wifiManager(wifiMgr)
    , mqtt_topic(topic)
    , mqtt_port(port)
{
}

bool MQTTManager::connect() {
    // Check WiFi first
    if (!wifiManager.isWiFiConnected()) {
        Serial.println("\n----- MQTT Connection Status -----");
        Serial.println("Error: WiFi not connected");
        Serial.println("Suggestion: Establish WiFi connection first");
        Serial.println("----------------------");
        return false;
    }

    if (!client.connected()) {
        Serial.println("\n----- MQTT Connection Status -----");
        
        // Get the appropriate MQTT server based on current network
        const char* mqtt_server = (WiFi.SSID() == String(ssid1)) ? mqtt_server1 : mqtt_server2;
        
        // Set server every time before connecting
        client.setServer(mqtt_server, mqtt_port);
        
        // Set larger buffer size for messages
        client.setBufferSize(512);
        
        Serial.printf("Broker: %s:%d\n", mqtt_server, mqtt_port);
        
        // Create a random client ID
        String clientId = "ESP32Client-";
        clientId += String(random(0xffff), HEX);
        
        // Try to connect with more options
        if (client.connect(clientId.c_str(), 
                          nullptr,    // username
                          nullptr,    // password
                          "/home/sensors/status",  // will topic
                          1,         // will qos
                          true,      // will retain
                          "offline", // will message
                          true      // clean session
                          )) {
            // Add small delay after connection
            delay(100);
            
            Serial.println("Status: Connected Successfully");
            Serial.println("Publishing online status...");
            
            // Publish with QoS 1 and retry
            int retries = 3;
            while (retries > 0 && !client.publish("/home/sensors/status", "online", true)) {
                Serial.println("Status publish failed, retrying...");
                delay(100);
                retries--;
            }
            
            Serial.println("----------------------");
            return true;
        }
        
        Serial.println("Status: Connection Failed");
        Serial.printf("Client State: %d\n", client.state());
        printConnectionState();
        Serial.println("----------------------");
        return false;
    }
    return true;
}

bool MQTTManager::publish(const char* topic, const char* payload) {
    // Check WiFi first
    if (!wifiManager.isWiFiConnected()) {
        Serial.println("\n----- MQTT Status -----");
        Serial.println("Error: WiFi not connected");
        Serial.println("Suggestion: Establish WiFi connection first");
        Serial.println("----------------------");
        return false;
    }

    // Check connection state
    if (!client.connected()) {
        Serial.println("\n----- MQTT Status -----");
        Serial.printf("Connection Check Failed - State: %d\n", client.state());
        printConnectionState();
        return false;
    }

    bool success = client.publish(topic, payload);
    
    Serial.println("\n----- MQTT Status -----");
    if (success) {
        Serial.println("Status: Published Successfully");
        Serial.printf("Broker: %s:%d\n", 
            (WiFi.SSID() == String(ssid1)) ? mqtt_server1 : mqtt_server2, 
            mqtt_port);
        Serial.printf("Topic: %s\n", topic);
        Serial.printf("Payload Size: %d bytes\n", strlen(payload));
        Serial.println("Payload: ");
        Serial.println(payload);
    } else {
        Serial.println("Status: Publish Failed");
        Serial.printf("Broker: %s:%d\n", 
            (WiFi.SSID() == String(ssid1)) ? mqtt_server1 : mqtt_server2, 
            mqtt_port);
        Serial.printf("Topic: %s\n", topic);
        Serial.printf("Payload Size: %d bytes\n", strlen(payload));
        Serial.printf("Client State: %d\n", client.state());
        printConnectionState();
    }
    Serial.println("----------------------");
    
    return success;
}

void MQTTManager::loop() {
    client.loop();
}

bool MQTTManager::subscribe(const char* topic, void (*callback)(const char*)) {
    // Check WiFi first
    if (!wifiManager.isWiFiConnected()) {
        Serial.println("\n----- MQTT Subscription -----");
        Serial.println("Error: WiFi not connected");
        Serial.println("Suggestion: Establish WiFi connection first");
        Serial.println("----------------------");
        return false;
    }

    Serial.println("\n----- MQTT Subscription -----");
    Serial.printf("Topic: %s\n", topic);
    
    // Store the callback
    messageCallback = callback;
    
    // Set the callback wrapper that will call our stored callback
    client.setCallback([this](char* topic, byte* payload, unsigned int length) {
        Serial.println("\n----- MQTT Message Received -----");
        Serial.printf("Topic: %s\n", topic);
        
        // Create null-terminated string from payload
        char message[length + 1];
        memcpy(message, payload, length);
        message[length] = '\0';
        
        Serial.printf("Payload Size: %d bytes\n", length);
        Serial.println("Payload: ");
        Serial.println(message);
        Serial.println("----------------------");
        
        // Call the stored callback
        if (messageCallback) {
            messageCallback(message);
        }
    });
    
    // Subscribe to the topic
    bool success = client.subscribe(topic);
    if (success) {
        Serial.println("Status: Subscribed Successfully");
    } else {
        Serial.println("Status: Subscription Failed");
        Serial.printf("Client State: %d\n", client.state());
        printConnectionState();
    }
    Serial.println("----------------------");
    
    return success;
}

void MQTTManager::printConnectionState() {
    switch (client.state()) {
        case -4: 
            Serial.println("Error: Connection Timeout");
            Serial.println("Suggestion: Check broker availability and network latency");
            break;
        case -3: 
            Serial.println("Error: Connection Lost");
            Serial.println("Suggestion: Check network stability and WiFi signal strength");
            break;
        case -2: 
            Serial.println("Error: Connection Failed");
            Serial.println("Suggestion: Verify broker address and port");
            break;
        case -1: 
            Serial.println("Error: Disconnected");
            Serial.println("Suggestion: Check if broker is running and accessible");
            break;
        case 0: 
            Serial.println("Status: Connected");
            Serial.println("Note: Client is connected but publish failed");
            break;
        case 1: 
            Serial.println("Error: Bad Protocol");
            Serial.println("Suggestion: Check MQTT protocol version compatibility");
            break;
        case 2: 
            Serial.println("Error: Bad Client ID");
            Serial.println("Suggestion: Verify client ID is unique and acceptable");
            break;
        case 3: 
            Serial.println("Error: Broker Unavailable");
            Serial.println("Suggestion: Verify broker is running and accepting connections");
            break;
        case 4: 
            Serial.println("Error: Bad Credentials");
            Serial.println("Suggestion: Check username and password if required");
            break;
        case 5: 
            Serial.println("Error: Unauthorized");
            Serial.println("Suggestion: Verify access rights for topic");
            break;
        default: 
            Serial.println("Error: Unknown");
            Serial.println("Suggestion: Check logs on broker side");
            break;
    }
}

bool MQTTManager::publish(const SensorData& data) {
    // Check WiFi first
    if (!wifiManager.isWiFiConnected()) {
        Serial.println("\n----- MQTT Telemetry Status -----");
        Serial.println("Error: WiFi not connected");
        Serial.println("Suggestion: Establish WiFi connection first");
        Serial.println("----------------------");
        return false;
    }

    // Check connection state
    if (!client.connected()) {
        Serial.println("\n----- MQTT Telemetry Status -----");
        Serial.printf("Connection Check Failed - State: %d\n", client.state());
        printConnectionState();
        return false;
    }

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
    jsonPayload += "\"target_energy\":" + String(data.energy) + ",";
    jsonPayload += "\"pm25\":" + String(data.pm25) + ",";
    jsonPayload += "\"pm10\":" + String(data.pm10);
    jsonPayload += "}";

    // Check payload size against new buffer size
    if (jsonPayload.length() > 512) {
        Serial.println("\n----- MQTT Telemetry Status -----");
        Serial.printf("Payload Size Error: %d bytes (max: %d)\n", 
            jsonPayload.length(), 512);
        return false;
    }

    Serial.println("\n----- MQTT Telemetry Status -----");
    Serial.printf("Publishing to topic: %s\n", mqtt_topic);
    Serial.printf("Payload (%d bytes):\n%s\n", jsonPayload.length(), jsonPayload.c_str());

    // Try publishing with retries
    int retries = 3;
    bool success = false;
    
    while (retries > 0 && !success) {
        success = client.publish(mqtt_topic, jsonPayload.c_str(), true);
        if (!success) {
            Serial.printf("Publish attempt failed, %d retries remaining\n", retries-1);
            delay(100);
            retries--;
        }
    }
    
    if (success) {
        Serial.println("Status: Telemetry Published Successfully");
    } else {
        Serial.println("Status: Telemetry Publish Failed after all retries");
        Serial.printf("Client State: %d\n", client.state());
        printConnectionState();
    }
    Serial.println("----------------------");

    return success;
} 