#include <SDS011.h> // Include the SDS011 library
#include <Arduino.h>

float p10, p25;  // Variables to store PM2.5 and PM10 readings
int error;       // Error code for communication

SDS011 my_sds;   // Create an instance of the SDS011 sensor

void setup() {
  my_sds.begin(3, 2);  // Initialize sensor with RX on pin 10, TX on pin 11
  Serial.begin(9600);    // Start serial communication at 9600 baud rate
  delay(3000);           // Add a 3-second delay for sensor stabilization
}

void loop() {
  // Read PM2.5 and PM10 values from the sensor
  error = my_sds.read(&p25, &p10);
  
  if (!error) {
    // If no error, print the readings to the Serial Monitor
    Serial.println("P2.5: " + String(p25));  // Print PM2.5 value
    Serial.println("P10:  " + String(p10));  // Print PM10 value
  } else {
    // If there was an error, print the error code
    Serial.print("Error: ");
    Serial.println(error);
  }
  
  delay(10000);  // Wait for 100ms before taking the next reading
}
