const config =  require("./config.json")
const mysql = require("mysql");


class MySql {
    pool = mysql.createPool(config.db)
    constructor() {
        this.pool.on("connection", conn => {
            conn.query("SET time_zone='+07:00';", error => {
                if (error) {
                    throw error;
                }
            })
        })
    }
    query (){
        let queryArgs = Array.prototype.slice.call(arguments),
            events = [],
            eventNameIndex = {}

        this.pool.getConnection((err, conn) => {
            if (err) {
                console.error(err)
                if (eventNameIndex.error) {
                    eventNameIndex.error()
                }
            }
            if (conn) {
                let q = conn.query.apply(conn, queryArgs);
                q.on("end", () =>{
                    conn.release()
                })

                events.forEach((args)=> {
                    q.on.apply(q, args)
                })
            }
        })

        return {
            on: (eventName, callback) =>{
                events.push(Array.prototype.slice.call(arguments))
                eventNameIndex[eventName] = callback
                return this
            }
        }
    }

}
module.exports = new MySql()