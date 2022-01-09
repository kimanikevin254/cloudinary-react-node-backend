const express = require('express');
var cors = require('cors');
const { cloudinary } = require('./cloudinary')

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.post('/api/uploadImg', (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = cloudinary.uploader.upload(fileStr, {
            folder: 'tuts',
        });
        res.json({ msg: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong...' });
    }
})

app.get('/api/images', async (req, res) => {
    const { resources } = await cloudinary.search
        .expression('folder:tuts')
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute();

    const publicIds = resources.map((file) => file.public_id);
    res.send(publicIds);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('listening on 3001');
});