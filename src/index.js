const express = require('express');
const cors = require('cors');
const path = require('path')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const urlSlug = require('url-slug')
const shortUrl = require('./model/url.model')
const uniqueName = require('./model/uniqueName.model')
const log = require('./model/log.model')
const userAccessInfo = require('./model/userAccessInfo.model')
const auth = require('./middleware/auth')
const logger = require('./middleware/logger')
const logUserAccessInfo = require('./middleware/userAccess')
const constData = require('./const')
const port = process.env.PORT || 3001;

require('./db/mongoose')

const app = express();

app.use(cors({
    credentials: true,
    origin: true
}));
app.use(express.json())
app.use(cookieParser())

app.use(morgan(constData.tokenFormat, {
    stream: logger,
    skip: (req, res) => !(req.params && req.params.url)
}))

app.get('/t/:url', async (req, res) => {
    try {
        const url = await shortUrl.findOne({ fromUrl: req.params.url })
        res.status(200).send({url:url.toUrl})
        if (url.count) url.count += 1
        else url.count = 1;
        url.save();
        if (req.query && req.query.additional) logUserAccessInfo(req.query.additional, req.params.url, url.toUrl);
    } catch (err) {
        res.status(404).send({ err })
    }
})

app.get('/all-urls', auth, async (req, res) => {
    try {
        const urls = await shortUrl.find();
        res.status(200).send({ urls })
    } catch (error) {
        res.status(500).send({ error })
    }
})

app.delete('/url', auth, async (req, res) => {
    try {
        const id = req.body.id
        const url = await shortUrl.findByIdAndDelete(id)
        if (!url) return res.status(404).send()
        if (url.setFromUniqueNames) {
            const name = new uniqueName({
                name: url.fromUrl
            });
            await name.save()
        }
        res.status(200).send(url)
    } catch (error) {
        res.status(500).send({ error })
    }
})

app.post('/shorten-url', auth, async (req, res) => {
    try {
        let fromUrl, toUrl, url;
        if (req.body.title) {
            fromUrl = urlSlug(req.body.title);
            toUrl = req.body.url
            let tempFromUrl = await uniqueName.findOneAndDelete({ name: fromUrl })
            if (tempFromUrl) {
                fromUrl = tempFromUrl.name
                url = new shortUrl({
                    toUrl,
                    fromUrl,
                    setFromUniqueNames: true
                })
            } else {
                url = new shortUrl({
                    toUrl,
                    fromUrl,
                    setFromUniqueNames: false
                })
            }
        } else {
            fromUrl = await uniqueName.findOneAndDelete();
            fromUrl = urlSlug(fromUrl.name)
            toUrl = req.body.url
            url = new shortUrl({
                toUrl,
                fromUrl,
                setFromUniqueNames: true
            })
        }

        await url.save()
        res.status(200).send({ url: fromUrl })
    } catch (error) {
        if (error.message)
            res.status(500).send({ error: error.message })
    }
})

app.post('/set-url-names', auth, async (req, res) => {
    try {
        const names = req.body.names
        for (let index = 0; index < names.length; index++) {
            const name = new uniqueName({
                name: urlSlug(names[index])
            });
            await name.save()
        }
        res.status(200).send({ success: 'Successfully Set New Unique Names' })
    } catch (error) {
        res.status(500).send({ error })
    }
})

app.get('/user-access-logs', auth, async (req, res) => {
    try {
        const sort = {}
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        const userAccessArray = await userAccessInfo.find({}, null, {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }).exec()
        res.status(200).send({ logs: userAccessArray })
    } catch (error) {
        res.status(500).send({ error })
    }
})

app.get('/all-logs', auth, async (req, res) => {
    try {
        const sort = {}
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        const logsArray = await log.find({}, null, {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }).exec()
        res.status(200).send({ logs: logsArray })
    } catch (error) {
        res.status(500).send({ error })
    }
})

const privateDirectoryPath = path.join(__dirname, '../private')
const loginDirectoryPath = path.join(__dirname, '../login')
const logDirectoryPath = path.join(__dirname, '../logs')

app.use('/enter-key', express.static(loginDirectoryPath))
app.use('/logs', auth, express.static(logDirectoryPath))
app.use('/', auth, express.static(privateDirectoryPath))

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})