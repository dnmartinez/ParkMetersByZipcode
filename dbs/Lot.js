const mongoose = require('mongoose')

const LotSchema = new mongoose.Schema({
	available_spaces: Number,
	description: String,
	id: Number,
	last_update: String,
	latitude: Number,
	longitude: Number,
	name: String,
	street_address: String,
	zip_code: Number
})

module.exports = mongoose.model('Lot', LotSchema)