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

// ERRORS  
server.get('/error', (request, response) => {
    response.render('pages/error');
});

// Rendering New Search
server.get('/new', (req, res) => {
    res.render('pages/searches/new');
});


// Shows the Results 
server.post('/searches', (req, res) => {
    
    let keyword = req.body.search;

    if (req.body.searchtype === 'sticker') {

       var url = `api.giphy.com/v1/stickers/search?api_key=${process.env.GIFT_API}&q=${keyword}` ;
        console.log(' sticker url : \n\n\n\n\n\n ', url);   
    }
    else if (req.body.searchtype === 'gif') {
        var  url = `http://api.giphy.com/v1/gifs/search?api_key=${process.env.GIFT_API}&q=${keyword}`;
        console.log(' gif url : \n\n\n\n\n\n', url);   
    }

    superagent.get(url)
        .then(data => {
            // console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaa Boddddddddddddddy : ', data.body);
            // console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaa Itemmmmmmmmmmmmmmmms : ', data.body.data);
            let arr = data.body.data;
            let gifts = arr.map(gift => {
                console.log('gift : ', gift.images.downsized_large.url);
                return new Gift(gift);
            });
            res.render('pages/gifts/show', { gifts: gifts })
        })
        .catch(error => {
            // console.log('Errorrrrrrrrrrrr : ', error);
            res.render('pages/error');
        });
});


function Gift(data) {

    //The PIPE used if there's an empty data , to avoid error 
    this.type = data.type;
    this.title = data.title;
    this.source = (data.source && data) || ' No Source Found';
    this.image = (data.images.preview_gif.url) || ' No Image Found ';
} // End of gift constructor function 


/**************************************************** Server Listening  ********************************************/
server.listen(PORT, () => console.log(`Nawal Solo App , listening On port # : ${PORT}`));
