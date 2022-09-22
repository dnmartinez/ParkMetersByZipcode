
	Model.count({}, function(err, count){
		console.log( "----->>>>> Number of docs: ", count );
	});

	var totCount = await Model.count({})
	console.log("+++++++", totCount)

	~~~~~~~~~~~~~~~~~~~~~`
90401
~~~~~~~~~~~~~~~~~~~~~~`
90401
~~~~~~~~~~~~~~~~~~~~~~`
90404
~~~~~~~~~~~~~~~~~~~~~~`
90401
~~~~~~~~~~~~~~~~~~~~~~`
90404
~~~~~~~~~~~~~~~~~~~~~~`
90401
~~~~~~~~~~~~~~~~~~~~~~`
90404
~~~~~~~~~~~~~~~~~~~~~~`
90404
~~~~~~~~~~~~~~~~~~~~~~`
90405
~~~~~~~~~~~~~~~~~~~~~~`
90405
~~~~~~~~~~~~~~~~~~~~~~`
90405
~~~~~~~~~~~~~~~~~~~~~~`
90404
~~~~~~~~~~~~~~~~~~~~~~`
90401
~~~~~~~~~~~~~~~~~~~~~~`
90401
~~~~~~~~~~~~~~~~~~~~~~`
90405
~~~~~~~~~~~~~~~~~~~~~~`
90403
~~~~~~~~~~~~~~~~~~~~~~`
90404
~~~~~~~~~~~~~~~~~~~~~~`
90405
~~~~~~~~~~~~~~~~~~~~~~`
90405
~~~~~~~~~~~~~~~~~~~~~~`
90403




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

async function getLots(Model, zipcode){
	let lots = []
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

async function addZipCode() {

}

async function insertMeterZip(Model2, active, meter_id, street_address, zip_code, index) {
	try {
		await Model2.create({
			active: active[index],
			meter_id: meter_id[index],
			street_address: street_address[index], 
			zip_code: zip_code
		})
	} catch (error) {
		console.log(error.message)
	}
}

async function createMeterZipDB(Model, Model2) {
	// initialize arrays with data for MeterZipCode Database
	console.log('%%%%%%%%%%%%%%')
	var latlongArray = await getLatLong(Model)
	// var active =  getData(Model, 'active')
	// var meter_id =  getData(Model, 'meter_id')
	// var street_address = await getData(Model, 'street_address')

	for(let i = 0; i < 6423; i++) {
		var pair = latlongArray[i]
		/* 
			Use Axios to get Reverse Geocode given latitude and longitude.
		 	Data retrieved is formated into an array of objects.
		 	It is divided into results:[{locations:[postalCode]}]
		*/
		
	
		axios.get(geoData.geoURL(pair[0],pair[1])).then(response => response.data).then(async data => {
			r = data['results']
			for(let j = 0; j < r.length; j++) {
				l = r[j]['locations']
				for(let k = 0; k < l.length; k++) {
					var zipCode = l[k]['postalCode']
					// remove additional information from zipcode and cast to Number
					if(zipCode.includes('-')) {
						zipCode = Number(zipCode.substring(0, zipCode.indexOf('-')))
					} else {
							zipCode = Number(zipCode)
					}
						
						//insertMeterZip(Model2, active, meter_id, street_address, zipCode, i)
						
					await Model2.create({ zip_code:zipCode })	
				}
			}
		}).catch(error => console.error(error))	
	}
}

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

async function getData(Model, field) {
	var dbData = await Model.find({})
	var data =[]
	for(let index = 0; index < dbData.length; index++) {
		data.push(dbData[index][field])
	}
	return data
}

async function getTotActiveMeters() {

}

async function getTotSpaces() {

}

module.exports = {
	process_data,
	getLots,
	createMeterZipDB,
}