#include "WiFiManager.h"
#include "esp_wpa2.h"
#include <Arduino.h>

WiFiManager::WiFiManager() 
    : currentNetwork(0)
    , isConnected(false)
    , lastConnectionAttempt(0)
    , retryCount(0) {
    // Initialize networks array
    networks[0] = {nullptr, nullptr};
    networks[1] = {nullptr, nullptr};
}

void WiFiManager::addNetwork(int index, const char* ssid, const char* password) {
    if (index >= 0 && index < 2) {
        networks[index] = {ssid, password};
    }
}

bool WiFiManager::connectToNetwork(const char* ssid, const char* password) {
    if (isEnterpriseMode) {
        WiFi.disconnect(true);
        WiFi.mode(WIFI_STA);
        esp_wifi_sta_wpa2_ent_set_identity((uint8_t *)enterpriseIdentity, strlen(enterpriseIdentity));
        esp_wifi_sta_wpa2_ent_set_username((uint8_t *)enterpriseIdentity, strlen(enterpriseIdentity));
        esp_wifi_sta_wpa2_ent_set_password((uint8_t *)enterprisePassword, strlen(enterprisePassword));
        esp_wifi_sta_wpa2_ent_enable();
        WiFi.begin(ssid);
    } else {
        WiFi.begin(ssid, password);
    }
    
    // Wait for connection with timeout
    unsigned long startAttempt = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startAttempt < RETRY_DELAY) {
        delay(500);
        Serial.print(".");
    }
    Serial.println();
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.printf("Connected to %s\n", ssid);
        Serial.printf("IP address: %s\n", WiFi.localIP().toString().c_str());
        return true;
    }
    
    Serial.printf("Failed to connect to %s\n", ssid);
    return false;
}

void WiFiManager::resetConnectionStatus() {
    isConnected = false;
    retryCount = 0;
    WiFi.disconnect();
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
        
        if (connectToNetwork(networks[currentNetwork].ssid, 
                           networks[currentNetwork].password)) {
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

void WiFiManager::configureEnterprise(const char* identity, const char* password) {
    isEnterpriseMode = true;
    enterpriseIdentity = identity;
    enterprisePassword = password;
}
