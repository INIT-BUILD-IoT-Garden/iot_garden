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

public:
    MQTTManager(WiFiManager& wifiMgr, const char* topic, int port = 1883);
    bool connect();
    bool publish(const SensorData& data);
    void loop();
    bool isConnected() { return client.connected(); }
};

#endif