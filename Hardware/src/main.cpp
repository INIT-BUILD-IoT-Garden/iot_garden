#include <Wire.h>
#include <Arduino.h>
#include "Adafruit_seesaw.h"
#include "DHT.h"
#include "Adafruit_CCS811.h"

#define DHTPIN 4     // Define the pin you connected the DHT11 data pin to
#define DHTTYPE DHT11   // DHT11 sensor type
#define MQ8_PIN 34  // Analog pin for MQ-8 sensor
#define CCS811_WAKE 5  // Optional: Connect WAKE pin to GPIO5 or connect directly to GND

Adafruit_seesaw ss;
DHT dht(DHTPIN, DHTTYPE);
Adafruit_CCS811 ccs;

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);
  
  Serial.println("Soil Sensor, DHT11 Temperature and Humidity Sensor, MQ-8 Hydrogen Gas Sensor, and CCS811 Air Quality Sensor test!");
  
  // Initialize I2C
  Wire.begin(22, 21);
  
  // Initialize DHT11
  dht.begin();
  
  // Initialize CCS811
  if(!ccs.begin()) {
    Serial.println("Failed to start CCS811! Please check your wiring.");
    while(1);
  }
  
  // Wait for the sensor to be ready
  while(!ccs.available());
  
  // Initialize soil sensor
  if (!ss.begin(0x36)) {
    Serial.println("ERROR! seesaw not found");
    Serial.println("Check your connections and verify the address");
    while(1) {
      delay(1000);
      Serial.println("Retrying...");
      if (ss.begin(0x36)) {
        Serial.println("seesaw found!");
        break;
      }
    }
  } else {
    Serial.print("seesaw started! version: ");
    Serial.println(ss.getVersion(), HEX);
  }
}

void loop() {
  // Read soil sensor
  float soilTemp = ss.getTemp();
  uint16_t capread = ss.touchRead(0);
  
  // Read DHT11
  float humidity = dht.readHumidity();
  float airTemp = dht.readTemperature();

  // Check if DHT11 reading failed
  if (isnan(humidity) || isnan(airTemp)) {
    Serial.println("Failed to read from DHT sensor!");
  } else {
    Serial.println("\n----- DHT11 Readings -----");
    Serial.print("Air Temperature: "); Serial.print(airTemp); Serial.println("°C");
    Serial.print("Humidity: "); Serial.print(humidity); Serial.println("%");
  }

  Serial.println("\n----- Soil Sensor Readings -----");
  Serial.print("Soil Temperature: "); Serial.print(soilTemp); Serial.println("°C");
  Serial.print("Soil Moisture: "); Serial.println(capread);
  
  // Read MQ-8 sensor
  int h2Value = analogRead(MQ8_PIN);
  float h2Voltage = h2Value * (5.0 / 4095.0); // Convert to voltage (5V reference)
  // float h2Voltage = h2Value * (3.3 / 4095.0); // Convert to voltage (ESP32 has 12-bit ADC)
  
  Serial.println("\n----- MQ-8 Hydrogen Sensor Readings -----");
  Serial.print("H2 Raw Value: "); Serial.println(h2Value);
  Serial.print("H2 Voltage: "); Serial.print(h2Voltage); Serial.println("V");
  
  // Read CCS811
  if(ccs.available()) {
    if(!ccs.readData()) {
      Serial.println("\n----- CCS811 Air Quality Readings -----");
      Serial.print("CO2: ");
      Serial.print(ccs.geteCO2());
      Serial.println(" ppm");
      
      Serial.print("TVOC: ");
      Serial.print(ccs.getTVOC());
      Serial.println(" ppb");
    } else {
      Serial.println("ERROR reading CCS811 data");
    }
  }
  
  delay(2000);  // Wait 2 seconds between measurements
}