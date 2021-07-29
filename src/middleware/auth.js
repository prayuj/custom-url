const auth = (req, res, next) => {
    if ((req.cookies.key && req.cookies.key === process.env.key) || req.headers.key && req.headers.key === process.env.key)
        next()
    else {
        res.status(401).send({error: 'Unauthenticated Request'})
    }
}

module.exports = auth