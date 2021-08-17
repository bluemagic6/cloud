const bodyParser = require('body-parser');
const express = require('express');
const upload = require('./uploads/multer');
const cloudinary = require('./uploads/cloudinary');
const fs = require('fs');
const { async } = require('q');
const app = express();

app.use(bodyParser,urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    console.log("Hello world")
});

app.use('upload-images', upload.array('image'), async (req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path, 'Images')
    
    if (req.method === 'POST')
    {
        const urls = []

        const files = req.files

        for (const file of files) {
            const { path } = file
            const newPath = await uploader(path)

            urls.push(newPath)

            fs.unlinkSync(path)
        }

        res.status(200).json({
            message: 'Images Uploaded Successful',
            data:urls 
        })
    } else {
        res.status(404).json({
            err:"Images not uploaded successfully"
        })
    }
}),

app.listen(3002, () => {
    console.log("server is listening")
});