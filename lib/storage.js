
const Container = function() {

    const devicesMap = new Map();

    function getDeviceContainer(deviceId) {
        if (devicesMap.has(deviceId)) {
            return devicesMap.get(deviceId);
        } else {
            const containerMap = new Map();
            devicesMap.set(deviceId, containerMap);
            return containerMap;
        }
    }

    function set(deviceId, obj) {
        const containerMap = getDeviceContainer(deviceId);
        for (let objKey in obj) {
            let objValue = obj[objKey];
            let value;
            if (typeof objValue === 'string') {
                if (objValue.indexOf('.') > -1) {
                    value = Number.parseFloat(objValue);
                } else {
                    value = Number.parseInt(objValue, 10);
                }
            } else {
                value = objValue;
            }
            containerMap.set(objKey, value);
        }
        containerMap.set('ts', Date.now());
        return toObjectFromMapValue(containerMap);
    }

    function toObjectFromMapValue(map) {
        let obj = {};
        for (let [key, value] of map.entries()) {
            obj[key] = value;
        }
        return obj;
    }

    function toObject(deviceId) {
        const containerMap = getDeviceContainer(deviceId);
        return toObjectFromMapValue(containerMap);
    }

    function toJSON(deviceId) {
        return JSON.stringify(toObject(deviceId));
    }

    function get() {
        let obj = {};
        for (let [key1, deviceValuesMap] of devicesMap.entries()) {
            let nestedObj = {};
            for (let [key2, value2] of deviceValuesMap.entries()) {
                nestedObj[key2] = value2;
            }
            obj[key1] = nestedObj;
        }
        return obj;
    }

    return {
        set: set,
        get: get,
        toObject: toObject,
        toJSON: toJSON
    }
};

const cache = new Container();
module.exports = cache;