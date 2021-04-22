const axios = require('axios');

class HttpClient 
{
    static async post(url, data, headers)
    {
        let promise = new Promise((resolve, reject) => {
            
            axios.post(url, data, {headers: headers}).then(function (response){
                resolve(response);
            }).catch(function(error){
                reject(error);
            })
        })
        return promise;
    }

    static async get(url, headers)
    {
        let promise = new Promise((resolve, reject) => {
            //var url = "https://api.monday.com/v2";
            axios.post(url, data, {headers: headers}).then(function (response){
                resolve(response);
            }).catch(function(error){
                reject(error);
            })
        })
        return promise;
    }
}

module.exports = HttpClient;