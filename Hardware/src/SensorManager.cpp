#include "SensorManager.h"

SensorManager::SensorManager(int dhtPin, int mq8Pin, int rxPin, int txPin)
    : dht(dhtPin, DHT11)
    , MQ8_PIN(mq8Pin)
    , DHTPIN(dhtPin)
    , RX_PIN(rxPin)
    , TX_PIN(txPin)
    , radar(&Serial2, 9600, rxPin, txPin)
{
}

bool SensorManager::begin() {
    Wire.begin(22, 21);
    Serial2.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);
    dht.begin();
    
    if (!ccs.begin()) {
        Serial.println("Failed to start CCS811!");
        return false;
    }
    
    while(!ccs.available());
    
    if (!ss.begin(0x36)) {
        Serial.println("ERROR! seesaw not found");
        return false;
    }
    
    return true;
}

SensorData SensorManager::readSensors() {
    SensorData data = {};
    
    // Read soil sensor
    data.soilTemp = ss.getTemp();
    data.soilMoisture = ss.touchRead(0);
    
    // Read DHT11
    data.humidity = dht.readHumidity();
    data.airTemp = dht.readTemperature();
    
    // Read MQ-8
    data.h2Value = analogRead(MQ8_PIN);
    data.h2Voltage = data.h2Value * (5.0 / 4095.0);
    
    // Read CCS811
    if(ccs.available() && !ccs.readData()) {
        data.co2 = ccs.geteCO2();
        data.tvoc = ccs.getTVOC();
    }
    
    // Read Radar
    data.targetCount = radar.getTargetNumber();
    if (data.targetCount > 0) {
        data.speed = radar.getTargetSpeed();
        data.distance = radar.getTargetRange();
        data.energy = radar.getTargetEnergy();
    }
    
    return data;
}

void SensorManager::printReadings(const SensorData& data) {
    Serial.println("\n----- Sensor Readings -----");
    
    Serial.println("\n----- DHT11 Readings -----");
    if (isnan(data.humidity) || isnan(data.airTemp)) {
        Serial.println("Failed to read from DHT sensor!");
    } else {
        Serial.print("Air Temperature: "); Serial.print(data.airTemp); Serial.println("°C");
        Serial.print("Humidity: "); Serial.print(data.humidity); Serial.println("%");
    }

    Serial.println("\n----- Soil Sensor Readings -----");
    Serial.print("Soil Temperature: "); Serial.print(data.soilTemp); Serial.println("°C");
    Serial.print("Soil Moisture: "); Serial.println(data.soilMoisture);
    
    Serial.println("\n----- MQ-8 Hydrogen Sensor Readings -----");
    Serial.print("H2 Raw Value: "); Serial.println(data.h2Value);
    Serial.print("H2 Voltage: "); Serial.print(data.h2Voltage); Serial.println("V");
    
    Serial.println("\n----- CCS811 Air Quality Readings -----");
    Serial.print("CO2: "); Serial.print(data.co2); Serial.println(" ppm");
    Serial.print("TVOC: "); Serial.print(data.tvoc); Serial.println(" ppb");
    
    Serial.println("\n----- C4001 mmWave Sensor Readings -----");
    Serial.print("Target Count: "); Serial.println(data.targetCount);
    
    if (data.targetCount > 0) {
        Serial.print("Target Speed: "); Serial.print(data.speed); Serial.println(" m/s");
        Serial.print("Target Distance: "); Serial.print(data.distance); Serial.println(" m");
        Serial.print("Target Energy: "); Serial.println(data.energy);
    }
} 