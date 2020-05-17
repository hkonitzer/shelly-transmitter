# shelly-transmitter
API Endpoint for shelly devices to transmit sensordata to various other endpoints

Currently, only works (read: tested) with Shelly H&T sensors, 
the Fibaro Homecenter 3 and OpenHAB (with Shelly Binding).

The shelly H&T sensors are configured to report their sensor values to the 
HTTP GET endpoint at this server. This server transmits the sensordata to 
OpenHAB with active Shelly-Binding and to the Fibaro Homecenter 3.

## Configuration of the server

The server starts on Port 8180 by default, but you can use environment 
PORT to override this setting.
Some logs are available under the namespace "shelly-transmitter", 
set the DEBUG environment variable to "shelly-transmitter:*" to see these logs.

## Configuration of the devices

You need a configration for this in a file namend apiconfig_XXX.json
(Set XXX to your NODE_ENV variable, e.g. "production")

Example:
```
{
  "openhab": {
    "ht": {
      "host": "http://my-obenhab-ip:8080"
    }
  },
  "fibaro": {
    "host": "http://my-homecenter3-ip",
    "headers": {
      "authorization": "Basic XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "Content-Type": "application/json"
    },
    "devices": {
      "shellyht-f36de2": {
        "temp": 101,
        "hum": 102
      }
    }
  }
}
```

For each device, here a shelly H&T sensor, you need a configuration with the
fibaro device id and the exact name as showed/configured in OpenHAB.
In the example we have added two QADs in fibaro (Humidity & Temperature QAD).
The server will send the received sensordata from "shellyht-f36de2" to OpenHAB 
device "shellyht-f36de2" and the fibaro devices id 101 (temperature) and 
device id 102 (humidity).

In the Shelly H&T sensor you have to configure under the Actions tab -> 
REPORT SENSOR VALUES the url:
``http://my-shelly-transmitter-ip:8180/shelly/ht/shellyht-f36de2``

### View

The server has a little debug view: 
``http://my-shelly-transmitter-ip:8180/``.
Here you can see the latest sensor data with timestamps.

## Notice

Beware: No security at all, do not use this on open internet connections.