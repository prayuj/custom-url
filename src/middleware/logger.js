const split = require('split')
const log = require('../model/log.model')

const logger = split().on('data', (line) => {
    try {
        // const newLog = new log({
        //     line
        // })
        // newLog.save()
        console.log(line)
    } catch (error) {
        console.log('Could Not Log Request ', error)
    }
})

module.exports = logger