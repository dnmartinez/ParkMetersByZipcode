const mongoose = require('mongoose')

const MeterZipCodeSchema = new mongoose.Schema({
	active: Boolean,
	meter_id: String,
	street_address: String, 
	zip_code: Number
})

module.exports = mongoose.model('MeterZipCode', MeterZipCodeSchema)