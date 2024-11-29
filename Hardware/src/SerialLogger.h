#ifndef SERIAL_LOGGER_H
#define SERIAL_LOGGER_H

#include <Arduino.h>
#include "MQTTManager.h"

class SerialLogger : public Print {
private:
    MQTTManager& mqtt;
    const char* logTopic;
    char buffer[256];
    size_t bufferIndex = 0;
    unsigned long lastPublish = 0;
    const unsigned long PUBLISH_INTERVAL = 1000; // Publish every second

public:
    SerialLogger(MQTTManager& mqttManager, const char* topic) 
        : mqtt(mqttManager), logTopic(topic) {}

    virtual size_t write(uint8_t c) override {
        Serial.write(c); // Still write to regular serial

        // Add to buffer
        if (bufferIndex < sizeof(buffer) - 1) {
            buffer[bufferIndex++] = c;
        }

        // Publish if newline or buffer full or interval elapsed
        if (c == '\n' || bufferIndex >= sizeof(buffer) - 1 || 
            (millis() - lastPublish > PUBLISH_INTERVAL && bufferIndex > 0)) {
            publish();
        }

        return 1;
    }

    void publish() {
        if (bufferIndex > 0) {
            buffer[bufferIndex] = '\0';
            mqtt.publish(logTopic, buffer);
            bufferIndex = 0;
            lastPublish = millis();
        }
    }
};

#endif 