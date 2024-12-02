#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include <Wire.h>
#include "Adafruit_seesaw.h"
#include "DHT.h"
#include "Adafruit_CCS811.h"
#include "DFRobot_C4001.h"
#include <SDS011.h>

struct SensorData {
    float soilTemp;
    uint16_t soilMoisture;
    float airTemp;
    float humidity;
    int h2Value;
    float h2Voltage;
    uint16_t co2;
    uint16_t tvoc;
    uint8_t targetCount;
    float speed;
    float distance;
    uint16_t energy;
    float pm25;
    float pm10;
};

class SensorManager {
private:
    Adafruit_seesaw ss;
    DHT dht;
    Adafruit_CCS811 ccs;
    DFRobot_C4001_UART radar;
    SDS011 sds;
    HardwareSerial sdsSerial;
    
    const int MQ8_PIN;
    const int DHTPIN;
    const int RX_PIN;
    const int TX_PIN;
    const int SDS_RX_PIN;
    const int SDS_TX_PIN;

public:
    SensorManager(int dhtPin, int mq8Pin, int rxPin, int txPin, int sdsRx, int sdsTx);
    bool begin();
    SensorData readSensors();
    void printReadings(const SensorData& data);
};

#endif 