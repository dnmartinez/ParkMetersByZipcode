const axios =  require('axios')
var geoData = require('../config')

async function process_data(endURLPath, Model) {
	axios.get('https://parking.api.smgov.net/' + endURLPath).then(response => response.data).then(async data => {
		if(await Model.count({}) == 0) {
			await Model.insertMany(data)
		} else {
			await Model.updateMany({}, {$set: data})
			
		}	
	})
}

// Creates a Meter database witth zipcodes
async function createMeterZipDB(Model, Model2) {
	// initialize arrays with data for MeterZipCode Database
	var latlongArray = await getLatLong(Model)
	var active = await getData(Model, 'active')
	var meter_id = await getData(Model, 'meter_id')
	var street_address = await getData(Model, 'street_address')

	for(let i = 0; i < latlongArray.length; i++) {
		var pair = latlongArray[i]
		/* 
			Use Axios to get Reverse Geocode given latitude and longitude.
		 	Data retrieved is formated into an array of objects.
		 	It is divided into results:[{locations:[postalCode]}]
		*/
		axios.get(await geoData.geoURL(pair[0],pair[1])).then(response => response.data).then(async data => {
			r = data['results']
			for(let j = 0; j < r.length; j++) {
				l = r[j]['locations']
				for(let k = 0; k < l.length; k++) {
					var zipCode = l[k]['postalCode']
					// remove additional chars from zipcode and cast to Number
					if(zipCode.includes('-')) {
						zipCode = Number(zipCode.substring(0, zipCode.indexOf('-')))
					} else {
						zipCode = Number(zipCode)
					}

					// Populate MeterZipCode database
					try {
						await Model2.create({
							active: active[i],
							meter_id: meter_id[i],
							street_address: street_address[i], 
							zip_code: zipCode
						})
					} catch (error) {
						console.log(error.message)
					}				
				}
			} 
		})
	}
}

// Returns array to find meters zipcodes
async function getLatLong(Model) {
	var meterData = await Model.find({})
	var latlongArray =[]
	for(let index = 0; index < meterData.length; index++) {
		var temp =[]
		temp.push(meterData[index]['latitude'])
		temp.push(meterData[index]['longitude'])
		latlongArray.push(temp)		
	}
	return latlongArray
}

// Returns data from any database given a field
async function getData(Model, field) {
	var dbData = await Model.find({})
	var data =[]
	for(let index = 0; index < dbData.length; index++) {
		data.push(dbData[index][field])
	}
	return data
}

// Returns name, available spaces and street adress from Lots database
async function getLots(Model, zipcode){
	let lots = []
	// Retrieve data with given zip code
	if(await Model.where("zipcode").equals(zipcode)) {
		let data = await Model.where("zipcode").equals(zipcode)
		for(let index = 0; index < data.length; index++) {
			temp = {}
			temp.name= data[index]['name']
			temp.available_spaces = data[index]['available_spaces']
			temp.street_address = data[index]['street_address']
			lots.push(temp)
		}
	}	
	return lots
}

// Returns zipcode, active status, and meter id from meters
async function getMeters(Model, zipcode) {
	let meters = []
	zipcode = Number(zipcode)
	let data = await Model.find({zip_code: zipcode})
	for(let index = 0; index < data.length; index++) {
		temp = {}
		temp.active= data[index]['active']
		temp.meter_id = data[index]['meter_id']
		meters.push(temp)
	}	
	return meters
}

// Returns total amount of active meters
async function getTotActiveMeters(Model, zipcode) {
	return await Model.where('zip_code').equals(zipcode).count('active')
}

// Returns total amount of available parking lots 
async function getTotAvailableLots(Model, zipcode) {
	return await Model.where('zip_code').equals(zipcode).count('available_spaces').gt(0)
}


module.exports = {
	process_data,
	getLots,
	createMeterZipDB,
	getMeters,
	getTotActiveMeters,
	getTotAvailableLots
}