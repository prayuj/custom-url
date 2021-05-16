const express = require('express');
const cors = require('cors');
const path = require('path')
const shortUrl = require('./model/url.model')
const urlSlug = require('url-slug')
const port = process.env.PORT || 3001;

require('./db/mongoose')

const app = express();

app.use(cors());
app.use(express.json())
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

app.get('/t/:url', async (req, res) => {
    try {
        const url = await shortUrl.findOne({ fromUrl: req.params.url })
        res.redirect(url.toUrl)
    } catch (err) {
        res.redirect('/?redirect=false')
    }
})

app.get('/all-urls', async (req, res) => {
    try {
        const urls = await shortUrl.find();
        res.status(200).send({ urls })
    } catch (error) {
        res.status(500).send({ error })
    }
})

app.delete('/url', async (req, res) => {
    try {
        const id = req.body.id
        const url = await shortUrl.findByIdAndDelete(id)
        if (!url) return res.status(404).send()
        res.status(200).send(url)
    } catch (error) {
        res.status(500).send({ error })
    }
})

app.post('/shorten-url', async (req, res) => {
    try {
        let fromUrl = urlSlug(req.body.title);
        let toUrl = req.body.url
        let url = new shortUrl({
            toUrl,
            fromUrl
        })
        await url.save()
        res.status(200).send({ url: '/t/' + fromUrl })
    } catch (error) {
        res.send({ error })
    }
})

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})