#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <WiFi.h>
#include "esp_wpa2.h"

class WiFiManager {
private:
    static const int MAX_RETRY_COUNT = 3;
    static const unsigned long RETRY_DELAY = 5000; // 5 seconds
    
    struct NetworkCredentials {
        const char* ssid;
        const char* password;
        const char* identity;    // nullptr for regular WiFi
        const char* mqtt_server; // MQTT server for this network
        bool isEnterprise;
    };
    
    NetworkCredentials networks[2];
    int currentNetwork;
    
    bool isConnected;
    unsigned long lastConnectionAttempt;
    int retryCount;

    bool connectToNetwork(const NetworkCredentials& network);
    void resetConnectionStatus();

    IPAddress getDefaultGateway() const;

    bool testMQTTConnection(const IPAddress& ip) const;

public:
    WiFiManager();
    
    void addEnterpriseNetwork(int index, const char* ssid, const char* password, 
                            const char* identity, const char* mqtt_server);
    void addRegularNetwork(int index, const char* ssid, const char* password, 
                          const char* mqtt_server);
    
    bool connect();
    bool checkConnection();
    void disconnect();
    
    bool isWiFiConnected() const { return isConnected; }
    String getCurrentSSID() const { return WiFi.SSID(); }
    int getRSSI() const { return WiFi.RSSI(); }
    IPAddress getLocalIP() const { return WiFi.localIP(); }
    String getCurrentMqttServer() const;
    String scanForMQTTServer() const;
};

#endif
