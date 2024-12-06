#include "SensorManager.h"

SensorManager::SensorManager(int dhtPin, int mq8Pin, int rxPin, int txPin, int sdsRx, int sdsTx)
    : dht(dhtPin, DHT11)
    , MQ8_PIN(mq8Pin)
    , DHTPIN(dhtPin)
    , RX_PIN(rxPin)
    , TX_PIN(txPin)
    , SDS_RX_PIN(sdsRx)
    , SDS_TX_PIN(sdsTx)
    , radar(&Serial2, 9600, rxPin, txPin)
    , sdsSerial(1)
{
}

bool SensorManager::begin() {
    Wire.begin(22, 21);
    Serial2.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);
    dht.begin();
    
    // Initialize SDS011 with proper Serial configuration
    sdsSerial.begin(9600, SERIAL_8N1, SDS_RX_PIN, SDS_TX_PIN);
    delay(100);  // Give serial time to stabilize
    sds.begin(&sdsSerial);  // Remove pin parameters, they're already set in serial begin
    
    // Wake up the SDS011 sensor
    sds.wakeup();
    delay(3000); // Allow SDS011 to stabilize
    
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
    
    // Read SDS011
    int retries = 3;
    while (retries > 0) {
        int error = sds.read(&data.pm25, &data.pm10);
        if (!error && data.pm25 >= 0 && data.pm10 >= 0) {
            break;  // Successful reading
        }
        retries--;
        if (retries > 0) {
            delay(1000);  // Wait 1 second between retries
            sds.wakeup(); // Ensure sensor is awake
            delay(100);   // Short delay after wakeup
        }
    }
    
    if (retries == 0) {
        data.pm25 = -1;
        data.pm10 = -1;
        Serial.println("Error reading from SDS011 after multiple attempts");
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
    
    Serial.println("\n----- SDS011 Air Quality Readings -----");
    if (data.pm25 >= 0 && data.pm10 >= 0) {
        Serial.print("PM2.5: "); Serial.print(data.pm25); Serial.println(" μg/m³");
        Serial.print("PM10:  "); Serial.print(data.pm10); Serial.println(" μg/m³");
    } else {
        Serial.println("Failed to read from SDS011 sensor!");
    }
} 