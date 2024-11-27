#include "WiFiManager.h"
#include "esp_wpa2.h"
#include <Arduino.h>

WiFiManager::WiFiManager() 
    : currentNetwork(0)
    , isConnected(false)
    , lastConnectionAttempt(0)
    , retryCount(0) {
    // Initialize networks array with nullptr
    for (int i = 0; i < 2; i++) {
        networks[i] = {nullptr, nullptr, nullptr, nullptr, false};
    }
}

void WiFiManager::addEnterpriseNetwork(int index, const char* ssid, const char* password, 
                                     const char* identity, const char* mqtt_server) {
    if (index >= 0 && index < 2) {
        networks[index] = {ssid, password, identity, mqtt_server, true};
    }
}

void WiFiManager::addRegularNetwork(int index, const char* ssid, const char* password, 
                                  const char* mqtt_server) {
    if (index >= 0 && index < 2) {
        networks[index] = {ssid, password, nullptr, mqtt_server, false};
    }
}

bool WiFiManager::connectToNetwork(const NetworkCredentials& network) {
    WiFi.disconnect(true);
    WiFi.mode(WIFI_STA);

    if (network.isEnterprise) {
        esp_wifi_sta_wpa2_ent_set_identity((uint8_t *)network.identity, strlen(network.identity));
        esp_wifi_sta_wpa2_ent_set_username((uint8_t *)network.identity, strlen(network.identity));
        esp_wifi_sta_wpa2_ent_set_password((uint8_t *)network.password, strlen(network.password));
        esp_wifi_sta_wpa2_ent_enable();
        WiFi.begin(network.ssid);
    } else {
        WiFi.begin(network.ssid, network.password);
    }
    
    unsigned long startAttempt = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startAttempt < RETRY_DELAY) {
        delay(500);
        Serial.print(".");
    }
    Serial.println();
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.printf("Connected to %s\n", network.ssid);
        Serial.printf("IP address: %s\n", WiFi.localIP().toString().c_str());
        return true;
    }
    
    Serial.printf("Failed to connect to %s\n", network.ssid);
    return false;
}

bool WiFiManager::connect() {
    // If already connected, return true
    if (isConnected && WiFi.status() == WL_CONNECTED) {
        return true;
    }
    
    // Check if enough time has passed since last attempt
    if (millis() - lastConnectionAttempt < RETRY_DELAY) {
        return false;
    }
    
    lastConnectionAttempt = millis();
    
    // Try each configured network
    for (int i = 0; i < 2; i++) {
        currentNetwork = (currentNetwork + i) % 2;
        
        if (networks[currentNetwork].ssid == nullptr) {
            continue;
        }
        
        if (connectToNetwork(networks[currentNetwork])) {
            isConnected = true;
            retryCount = 0;
            return true;
        }
    }
    
    // If we get here, all connection attempts failed
    retryCount++;
    if (retryCount >= MAX_RETRY_COUNT) {
        Serial.println("Max retry count reached. Will reset ESP32...");
        delay(1000);
        ESP.restart();
    }
    
    return false;
}

bool WiFiManager::checkConnection() {
    if (WiFi.status() != WL_CONNECTED) {
        isConnected = false;
        Serial.println("WiFi connection lost!");
        return false;
    }
    return true;
}

void WiFiManager::disconnect() {
    WiFi.disconnect();
    isConnected = false;
    Serial.println("WiFi disconnected");
}

IPAddress WiFiManager::getDefaultGateway() const {
    tcpip_adapter_ip_info_t ip_info;
    tcpip_adapter_get_ip_info(TCPIP_ADAPTER_IF_STA, &ip_info);
    return IPAddress(ip_info.gw.addr);
}

String WiFiManager::getCurrentMqttServer() const {
    if (!isConnected) {
        return String();
    }
    
    if (networks[currentNetwork].mqtt_server != nullptr) {
        return String(networks[currentNetwork].mqtt_server);
    }
    
    // If no MQTT server specified, scan for one
    String scannedServer = scanForMQTTServer();
    if (scannedServer.length() > 0) {
        Serial.printf("Found MQTT server at: %s\n", scannedServer.c_str());
        return scannedServer;
    }
    
    // If no server found, return gateway IP as fallback
    return getDefaultGateway().toString();
}

bool WiFiManager::testMQTTConnection(const IPAddress& ip) const {
    WiFiClient testClient;
    if (testClient.connect(ip, 1883, 1000)) {  // 1 second timeout
        testClient.stop();
        return true;
    }
    return false;
}

String WiFiManager::scanForMQTTServer() const {
    if (!isConnected) {
        return String();
    }

    // First try gateway IP
    IPAddress gateway = getDefaultGateway();
    if (testMQTTConnection(gateway)) {
        return gateway.toString();
    }

    // Get our IP and subnet mask
    IPAddress localIP = WiFi.localIP();
    IPAddress subnet = WiFi.subnetMask();
    
    // Calculate network address
    IPAddress network(
        localIP[0] & subnet[0],
        localIP[1] & subnet[1],
        localIP[2] & subnet[2],
        localIP[3] & subnet[3]
    );

    // Scan first 20 addresses in the subnet
    for (int i = 1; i <= 20; i++) {
        IPAddress testIP(network[0], network[1], network[2], network[3] + i);
        if (testIP != localIP) {  // Skip our own IP
            Serial.printf("Testing IP: %s\n", testIP.toString().c_str());
            if (testMQTTConnection(testIP)) {
                return testIP.toString();
            }
        }
    }
    
    return String();
}
