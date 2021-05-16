const express = require('express');
const cors = require('cors');
const path = require('path')
var cookieParser = require('cookie-parser')
const shortUrl = require('./model/url.model')
const uniqueName = require('./model/uniqueName.model')
const auth = require('./middleware/auth')
const urlSlug = require('url-slug')
const port = process.env.PORT || 3001;

require('./db/mongoose')

const app = express();

app.use(cors());
app.use(express.json())
app.use(cookieParser())

app.get('/t/:url', async (req, res) => {
    try {
        const url = await shortUrl.findOne({ fromUrl: req.params.url })
        if (url.count) url.count += 1
        else url.count = 1;
        url.save();
        res.redirect(url.toUrl)
    } catch (err) {
        res.redirect('/')
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
        if (req.body.title) {
            let fromUrl = urlSlug(req.body.title);
            let toUrl = req.body.url
            let url = new shortUrl({
                toUrl,
                fromUrl,
                setFromUniqueNames: false
            })
            await url.save()
            res.status(200).send({ url: '/t/' + fromUrl })
        } else {
            let fromUrl = await uniqueName.findOneAndDelete();
            fromUrl = urlSlug(fromUrl.name)
            let toUrl = req.body.url
            let url = new shortUrl({
                toUrl,
                fromUrl,
                setFromUniqueNames: true
            })
            await url.save()
            res.status(200).send({ url: '/t/' + fromUrl })
        }

    } catch (error) {
        if (error.message)
            res.status(500).send({ error: error.message })
    }
})

app.post('/set-url-name', auth, async (req, res) => {
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


const privateDirectoryPath = path.join(__dirname, '../private')
const publicDirectoryPath = path.join(__dirname, '../public')

app.use('/enter-key', express.static(publicDirectoryPath))
app.use('/', auth, express.static(privateDirectoryPath))

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})