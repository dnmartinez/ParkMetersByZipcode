var express = require('express');
var router = express.Router();
const Lot = require('../dbs/Lot')
const MeterZipCode = require('../dbs/MeterZipCode')
var dataProcessor = require('../services/data_processor')

/* GET api page. */
router.get('/:zipcode', async(req, res, next) => {	
	var results = await dataProcessor.getLots(Lot,req.params.zipcode)
	var meters = await dataProcessor.getMeters(MeterZipCode, req.params.zipcode)
	results.push(meters)
	var totActiveMeters = await dataProcessor.getTotActiveMeters(MeterZipCode, req.params.zipcode)
	results.push(totActiveMeters)
	var getTotAvailableLots = await dataProcessor.getTotAvailableLots(MeterZipCode, req.params.zipcode)
	results.push(getTotAvailableLots)
	res.send(results)
})

module.exports = router;
