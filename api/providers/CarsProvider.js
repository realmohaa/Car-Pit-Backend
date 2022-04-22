const axios = require("axios");

const BASE_URL = process.env.CAR_API_URL;
const API_KEY = process.env.CAR_API_KEY;

const instance = axios.create({
    baseURL: BASE_URL,
})

class CarsProvider {

    constructor () { 
    }

    fetchCar = async (vin, callback) => {
        try {
            await instance.get('/specs?key=' + API_KEY + '&vin=' + vin)
                .then(result => {
                    const params = {
                        make: result.data.attributes.make,
                        model: result.data.attributes.model,
                        year: result.data.attributes.year,
                        engine: result.data.attributes.engine,
                        engine_cylinders: result.data.attributes.engine_cylinders,
                        style: result.data.attributes.style,
                        made_in: result.data.attributes.made_in,
                        fuel_capacity: result.data.attributes.fuel_capacity,
                        city_mileage: result.data.attributes.city_mileage,
                        highway_mileage: result.data.attributes.highway_mileage,
                        retail_price: result.data.attributes.retail_price
                    }
                    callback(params)
                })
        } catch(e){
            console.log(e)
        }
    }

    carHistory = async (vin) => {
        try {
            await instance.get('')
        } catch(e){
            console.log(e)
        }
    }

}

module.exports = CarsProvider