#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <WiFi.h>

class WiFiManager {
private:
    // Constants
    static const int MAX_RETRY_COUNT = 3;
    static const unsigned long RETRY_DELAY = 5000; // 5 seconds
    
    // Network credentials
    struct NetworkCredentials {
        const char* ssid;
        const char* password;
    };
    
    NetworkCredentials networks[2];
    int currentNetwork;
    
    // Status tracking
    bool isConnected;
    unsigned long lastConnectionAttempt;
    int retryCount;

    // Private methods
    bool connectToNetwork(const char* ssid, const char* password);
    void resetConnectionStatus();

public:
    WiFiManager();
    
    // Configuration
    void addNetwork(int index, const char* ssid, const char* password);
    
    // Connection management
    bool connect();
    bool checkConnection();
    void disconnect();
    
    // Status methods
    bool isWiFiConnected() const { return isConnected; }
    String getCurrentSSID() const { return WiFi.SSID(); }
    int getRSSI() const { return WiFi.RSSI(); }
    IPAddress getLocalIP() const { return WiFi.localIP(); }
};

#endif // WIFI_MANAGER_H
