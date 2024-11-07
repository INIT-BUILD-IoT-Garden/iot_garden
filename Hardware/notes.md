graph TB
    subgraph "IoT Devices"
        ESP1[ESP32 Device 1]
        ESP2[ESP32 Device 2]
        ESPn[ESP32 Device n]
    end

    subgraph "Message Broker Layer"
        MB[Mosquitto MQTT Broker]
        MB_FAIL[Failover Broker]
    end

    subgraph "Backend Services"
        API[API Gateway]
        AUTH[Auth Service]
        DEVICE[Device Management]
        DATA[Data Processing Service]
        ALERT[Alert Service]
    end

    subgraph "Data Layer"
        TS[(TimescaleDB)]
        REDIS[(Redis Cache)]
        META[(Metadata DB)]
    end

    subgraph "Frontend Layer"
        WEB[Web Dashboard]
        subgraph "Real-time Updates"
            WS[WebSocket Server]
        end
    end

------------------------------------

    ESP1 & ESP2 & ESPn -->|MQTT| MB
    MB -->|Failover| MB_FAIL
    MB -->|Subscribe| DATA
    DATA -->|Store| TS
    DATA -->|Cache| REDIS
    DATA -->|Notify| WS
    API -->|Query| TS
    API -->|Cache| REDIS
    API -->|Auth| AUTH
    AUTH -->|Store| META
    DEVICE -->|Manage| META
    WEB -->|HTTP| API
    WEB  -->|WebSocket| WS
    DATA -->|Trigger| ALERT
    ALERT -->|Notify| WEB

------------------------------------

1. IoT Device Layer
    - ESP32 Devices
        - Sensor data collection
        - Local data buffering
        - Error handling and recovery
        - Power management
        - Secure communication

2. Message Broker Layer
    - Primary MQTT Broker
        - Message queuing
        - Topic management
        - Client authentication
        - QoS handling
