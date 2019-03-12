'use strict';

const tessel = require('tessel');
const climatelib = require('climate-si7020');
const axios = require('axios');
const moment = require('moment-timezone');

const climate = climatelib.use(tessel.port['A']);

climate.on('ready', function() {
  console.log('Connection with climate module established.');

  setImmediate(function loop() {
    climate.readTemperature('f', (err, temp) => {
      climate.readHumidity((err, humid) => {
        axios
          .post(
            'https://maker.ifttt.com/trigger/sensor_log/with/key/crXPmJ-NzoGNN2zyOC67Fc',
            {
              value1: moment()
                .tz('America/New_York')
                .format(),
              value2: temp.toFixed(4),
              value3: humid.toFixed(4)
            }
          )
          .then(() => setTimeout(loop, 300000))
          .catch(err => console.log('An error has occurred: ', err));
      });
    });
  });
});

climate.on('error', function(err) {
  console.log('Connection with climate module failed: ', err);
});
