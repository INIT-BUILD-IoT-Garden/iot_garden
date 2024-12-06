
NAME           IMAGE                    COMMAND                  SERVICE        CREATED      STATUS                    PORTS
grafana        grafana/grafana          "/run.sh"                grafana        9 days ago   Up 44 minutes (healthy)   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp
influxdb       influxdb:1.8             "/entrypoint.sh inflâ¦"   influxdb       9 days ago   Up 44 minutes (healthy)   0.0.0.0:8086->8086/tcp, :::8086->8086/tcp
mosquitto      iotstack-mosquitto       "/docker-entrypoint.â¦"   mosquitto      9 days ago   Up 44 minutes (healthy)   0.0.0.0:1883->1883/tcp, :::1883->1883/tcp
nodered        iotstack-nodered         "./entrypoint.sh"        nodered        9 days ago   Up 44 minutes (healthy)   0.0.0.0:1880->1880/tcp, :::1880->1880/tcp
portainer-ce   portainer/portainer-ce   "/portainer"             portainer-ce   9 days ago   Up 44 minutes             0.0.0.0:8000->8000/tcp, :::8000->8000/tcp, 0.0.0.0:9000->9000/tcp, :::9000->9000/tcp, 0.0.0.0:9443->9443/tcp, :::9443->9443/tcp
