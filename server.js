'use strict';

/********************************************** dependencies ****************************************************/
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override')
const expressLayouts = require('express-ejs-layouts')

// PORT 
const PORT = process.env.PORT || 8822;

// Allows 
const server = express();
server.use(cors());

// DataBase
const client = new pg.Client(process.env.DB_URL);
client.on('error', err => console.error(err));

server.use(express.json());
server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }));
server.set('view engine', 'ejs');
// server.use(methodOverride(middleware));

/***************************************************** Routes  ****************************************************/

// Proof Of Life 
server.get('/pol', (req, res) => {
    res.render('pages/pol');
});

const url = `http://api.giphy.com/v1/stickers/search?q=human&api_key=${process.env.GIFT_API}`;
superagent.get(url)
    .then(data => {
        console.log('data : ', data.body.data);
    });


/**************************************************** Server Listening  ********************************************/
server.listen(PORT, () => console.log(`Nawal Solo App , listening On port # : ${PORT}`));
