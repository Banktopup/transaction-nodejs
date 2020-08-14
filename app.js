require('log-timestamp')
const config =  require("./config.json")
const db = require("./mysql")
const md5 = require('md5')
const scb =  new require("./scb")
const _scb = new scb(config.license,config.bank.deviceId,config.bank.pin)
_scb.setAccount(config.bank.account_number)
const run = async ()=>{
    try {
        let transaction = await _scb.Transaction(7,1,20)
        console.log("login success")
        console.log("check transactions")

        for (const v of transaction.data.result.txnList) {
            let tx_hash = md5(v["txnRemark"]+v["txnAmount"]+v["txnDateTime"])
            if (v['txnDebitCreditFlag'] !== "C") {
                continue;
            }
            db.query(
                "SELECT id FROM bank_tx WHERE tx_hash = ?",
                [tx_hash],
                (error, results) => {
                    if (error) throw error
                    if (results.length===0){
                        let arr = [
                            v["txnRemark"],
                            v['txnAmount'],
                            tx_hash,
                            v['txnDateTime']
                        ]
                        console.log("add tx <"+tx_hash+"> "+ v["txnRemark"]+v['txnAmount']+" "+tx_hash+" "+v['txnDateTime'])
                        db.query(
                            'INSERT INTO bank_tx (remark,amount,tx_hash,date_time) VALUES (?,?,?,?)',
                            arr
                        )

                    }
                })

            let summary = await _scb.Summary()
            let totalAvailableBalance = summary.data.result.totalAvailableBalance
            if (totalAvailableBalance >= config.balanceLimit){
                await  _scb.Transfer(config.backup_account,config.backup_bankcode,config.backup_balance)
                console.log("backup balance >",totalAvailableBalance," /to:",config['backup_account'],"/amount:",config['backup_balance'])

            }
        }
    }catch (e) {
        console.log("[error]",e.message)
        console.log("[error]",e.response.data)
    }
    console.log("===end===");

    setTimeout(run,30*1000)
}
(async ()=>{
   await run()
})()