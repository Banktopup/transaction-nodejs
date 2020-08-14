


class Scb {
    API = require('axios').default

    constructor(license,deviceid,pin) {
        this.API.defaults.headers.common['x-auth-license'] = license
        this.API.defaults.baseURL = 'https://api-v1.banktopup.com'
        this.DeviceID = deviceid
        this.Pin = pin
    }
    setAccount(account){
        this.Account = account
    }
    Transaction(previous_day,page_number,page_size){
       return this.API.post('/api/v1/scb/transactions', {
           deviceid: this.DeviceID,
           pin: this.Pin,
           account_no: this.Account,
           previous_day: previous_day,
           page_number: page_number,
           page_size: page_size,
       })
    }
    Transfer(account_to,bank_code,amount){
       return this.API.post('/api/v1/scb/transfer', {
            deviceid: this.DeviceID,
            pin: this.Pin,
            account_no: this.Account,
            account_to: account_to,
            bank_code: bank_code, //ดูที่ Bank List
            amount: amount,
        })
    }
    Summary(){
        return this.API.post('/api/v1/scb/summary', {
            deviceid: this.DeviceID,
            pin: this.Pin,
            account_no: this.Account
        })
    }

}
module.exports = Scb