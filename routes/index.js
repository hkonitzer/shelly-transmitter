const express = require('express');
const router = express.Router();
const cache = require('../lib/storage');

const hbs = require('hbs');
hbs.registerHelper('date2string', function (dateValue) { return new Date(dateValue); });

router.get('/', (req, res) => {
  res.render('index', { devices: cache.get() });
});

module.exports = router;
