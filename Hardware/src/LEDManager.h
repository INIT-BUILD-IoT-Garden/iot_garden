#ifndef LED_MANAGER_H
#define LED_MANAGER_H

#include <Arduino.h>

class LEDManager {
private:
    const int LED_PIN;
    const int LED_BLINK_INTERVAL;
    unsigned long lastLedToggle;
    bool ledState;
    int ledBlinkCount;

public:
    LEDManager(int pin, int blinkInterval = 100);
    void begin();
    void blink(int count);
    void update();
};

#endif 