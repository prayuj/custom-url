const userAccessInfo = require('../model/userAccessInfo.model');

const logUserAccessInfo = (additional, url, target) => {
    try {
        const newLog = new userAccessInfo({
            additional,
            url,
            target
        })
        newLog.save()
    } catch (error) {
        console.log('Could Not Log Request ', error)
    }
}

module.exports = logUserAccessInfo