
const mongoose = require('mongoose')

const MeterSchema = new mongoose.Schema({
	active: Boolean,
	area: String,
	latitude: Number,
	longitude: Number,
	meter_id: String,
	street_address: String, 
	zip_code: Number
})

module.exports = mongoose.model('Meter', MeterSchema)