#include "LEDManager.h"

LEDManager::LEDManager(int pin, int blinkInterval)
    : LED_PIN(pin)
    , LED_BLINK_INTERVAL(blinkInterval)
    , lastLedToggle(0)
    , ledState(false)
    , ledBlinkCount(0)
{
}

void LEDManager::begin() {
    pinMode(LED_PIN, OUTPUT);
    digitalWrite(LED_PIN, LOW);
}

void LEDManager::blink(int count) {
    ledBlinkCount = count * 2; // Multiply by 2 because each blink is on+off
    lastLedToggle = millis();
    ledState = true;
    digitalWrite(LED_PIN, HIGH);
}

void LEDManager::update() {
    if (ledBlinkCount > 0) {
        unsigned long currentMillis = millis();
        if (currentMillis - lastLedToggle >= LED_BLINK_INTERVAL) {
            lastLedToggle = currentMillis;
            ledState = !ledState;
            digitalWrite(LED_PIN, ledState);
            
            if (!ledState) {  // Just turned LED off
                ledBlinkCount--;
                if (ledBlinkCount == 0) {
                    digitalWrite(LED_PIN, LOW);  // Ensure LED is off
                }
            }
        }
    }
} 