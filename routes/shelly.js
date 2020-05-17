const express = require('express');
const router = express.Router();
const bent = require('bent');
const debug = require('debug')('shelly-transmitter:routes');

const nconf = require('nconf');

const SHELLYHT_OPENHAB_HOST = nconf.get('openhab:ht:host');
const openHabRequest = bent(SHELLYHT_OPENHAB_HOST, 'GET', 'string', 200);

const FIBARO_HOST = nconf.get('fibaro:host');
const FIBARO_REQUEST_HEADERS = nconf.get('fibaro:headers');
const fibaroRequest = bent(FIBARO_HOST, 'PUT', 'json', 200, FIBARO_REQUEST_HEADERS);

const cache = require('../lib/storage');

router.get('/ht/:id', (req, res) => {
    res.status(200).send();
    const containerData = cache.set(req.params.id, req.query);
    const url = `/shelly/event/${req.params.id}/sensordata?hum=${containerData['hum']}&temp=${containerData['temp']}`;
    const openHabResponse = openHabRequest(url);
    openHabResponse.catch((err) => {
        const m = err.message ? err.message : err;
        debug(`Error while transmitting sensordata to openhab host ${SHELLYHT_OPENHAB_HOST} with url ${url} `, m);
    });
    const fibaroDeviceIdForTemperature = nconf.get(`fibaro:devices:${req.params.id}:temp`);
    const fibaroResponseForTemperature = fibaroRequest(`/api/devices/${fibaroDeviceIdForTemperature}`, { properties: { value: containerData['temp'] }});
    fibaroResponseForTemperature.catch((err) => {
        const m = err.message ? err.message : err;
        debug(`Error while transmitting payload (temp) to fibaro host ${FIBARO_HOST} `, m);
    });
    const fibaroDeviceIdForHumidity = nconf.get(`fibaro:devices:${req.params.id}:hum`);
    const fibaroResponseForHumidity = fibaroRequest(`/api/devices/${fibaroDeviceIdForHumidity}`, { properties: { value: containerData['hum'] }});
    fibaroResponseForHumidity.catch((err) => {
        const m = err.message ? err.message : err;
        debug(`Error while transmitting payload (hum) to fibaro host ${FIBARO_HOST} `, m);
    });
});

module.exports = router;
