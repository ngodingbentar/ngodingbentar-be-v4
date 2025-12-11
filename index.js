const express = require('express');
require('dotenv').config();
const apiRouter = require('./routers/apiRouter.js');
// const connectDB = require('./config/db');
const mongoose = require('mongoose');
const cors = require('cors');
const Url = require('./models/urlModel.js');

const app = express();
app.use(cors())
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error("err.message", err.message);
    process.exit(1);
  }
};

connectDB();


app.use('/api/v1', apiRouter)

app.get('/', (req, res) => res.send('Home Page Route'));

app.get('/s/:code', async (req, res) => {
  try{
    const urlCode = req.params.code
    const url = await Url.findOne({urlCode})
    // console.log('url', url)
    if(url){
      return res.redirect(url.longUrl)
    } else {
      return res.status(404).json('Url not found')
    }
  } catch(err){
    console.log(err)
    res.send(500).json('Server Error')
  }
})

app.get('/about', (req, res) => res.send('About Page Route'));

app.get('/portfolio', (req, res) => res.send('Portfolio Page Route'));

app.get('/contact', (req, res) => res.send('Contact Page Route'));

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));