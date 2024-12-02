#ifndef MQTT_MANAGER_H
#define MQTT_MANAGER_H

#include <WiFi.h>
#include <PubSubClient.h>
#include <Arduino.h>
#include "WiFiManager.h"
#include "SensorManager.h"
#include "secrets.h"

class MQTTManager {
private:
    WiFiClient espClient;
    PubSubClient client;
    WiFiManager& wifiManager;
    const char* mqtt_topic;
    const int mqtt_port;
    void (*messageCallback)(const char*) = nullptr;
    
    void printConnectionState();

public:
    MQTTManager(WiFiManager& wifiMgr, const char* topic, int port = 1883);
    bool connect();
    bool publish(const SensorData& data);
    void loop();
    bool isConnected() { return client.connected(); }
    bool subscribe(const char* topic, void (*callback)(const char*));
    bool publish(const char* topic, const char* payload);
};

#endif