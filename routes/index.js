var express = require('express')
var router = express.Router()
const Lot = require('../dbs/Lot')
const Meter = require('../dbs/Meter')
const MeterZipCode = require('../dbs/MeterZipCode')

/* GET home page. */
router.get('/', function(req, res, next) {
  var processor = require('../services/data_processor')
  processor.process_data('lots', Lot)
  processor.process_data('meters', Meter)
  processor.createMeterZipDB(Meter, MeterZipCode)
  res.render('index', { title: 'Express' })
});

module.exports = router;
