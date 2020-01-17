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
server.use(methodOverride(middleware));

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

//Restore Data From DataBase 
server.get('/', (req, res) => {
    let SQL = `SELECT * FROM gifts `
    // // console.log('SQL : ', SQL);
    client.query(SQL)
        .then(data => {
            res.render('pages/index', { gifts: data.rows })
            // res.render('pages/indexshow');
        })
});


// Add GIF To DataBase 
server.post('/add', (req, res) => {
    // console.log('req.body : ', req.body);
    res.render('pages/searches/add', { gifts: req.body });
});


// Save GIF Details into DataBase then redirect me to the homePage with All saved books in DB 
server.post('/gifts', (req, res) => {
    // console.log('req.body : ', req.body);
    let { image, title,type, gifshelf } = req.body

    let SQL = `INSERT INTO gifts (image, title, type, gifshelf) VALUES ($1, $2, $3, $4)`
    // // console.log('SQL : ', SQL);
    let values = [image, title, type, gifshelf]
    // console.log('values : ', values);

    client.query(SQL, values)
        .then(() => {
            res.redirect('/')
        })
});


// Shows the Results 
server.post('/searches', (req, res) => {
    
    let keyword = req.body.search;

    if (req.body.searchtype === 'sticker') {

       var url = `api.giphy.com/v1/stickers/search?api_key=${process.env.GIFT_API}&q=${keyword}` ;
        // console.log(' sticker url : \n\n\n\n\n\n ', url);   
    }
    else if (req.body.searchtype === 'gif') {
        var  url = `http://api.giphy.com/v1/gifs/search?api_key=${process.env.GIFT_API}&q=${keyword}`;
        // console.log(' gif url : \n\n\n\n\n\n', url);   
    }

    superagent.get(url)
        .then(data => {
            // console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaa Boddddddddddddddy : ', data.body);
            // console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaa Itemmmmmmmmmmmmmmmms : ', data.body.data);
            let arr = data.body.data;
            let gifts = arr.map(gift => {
                // console.log('gift : ', gift.images.downsized_large.url);
                return new Gift(gift);
            });
            res.render('pages/gifts/show', { gifts: gifts })
        })
        .catch(error => {
            // console.log('Errorrrrrrrrrrrr : ', error);
            res.render('pages/error');
        });
});

// View Details
server.get('/gifts/:gifts_id', (req, res) => {
    let SQL = `SELECT * FROM gifts WHERE id=$1`
    // // console.log('SQL : ', SQL);
    let values = [req.params.gifts_id]
    // console.log('req.params.books_id : ', req.params.books_id);

    client.query(SQL, values)
        .then(results => {
            console.log('results.rows : ', results.rows);
            res.render('pages/gifts/details', { gifts: results.rows })
        });
});

// Update GIF details by clicking and show up the form to be able to update 
server.post('/update', (req, res) => {
    // console.log('req.body : ', req.body);
    res.render('pages/gifts/edit', { gifts: req.body });
})

// After finished update save the updated details into DB then redirect me to Homepage 
server.put('/update/:gifts_id', (req, res) => {

    let { image, title, type, gifshelf } = req.body;
    // // console.log('req.body : ', req.body);

    let SQL = `UPDATE gifts SET image=$1, title=$2, type=$3, gifshelf=$4 WHERE id=$5`
    // console.log('SQL : ', SQL);

    let values = [image, title, type, gifshelf, req.params.gifts_id];
    // console.log('values : ', values);
    
    client.query(SQL, values)
        .then(() => {
            res.redirect('/')
        })
});

function Gift(data) {

    //The PIPE used if there's an empty data , to avoid error 
    this.type = data.type;
    this.title = (data.title && data ) || ' No Title Found ';
    this.image = (data.images.preview_gif.url) || ' No Image Found ';
    this.rating = data.rating;
    this.source = data.source;
} // End of gift constructor function 


// For update and Delete , build-in function as it is .
function middleware(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
} // end of middleware function 


/**************************************************** Server Listening  ********************************************/
client.connect()
    .then(() => {
        server.listen(PORT, () => console.log(`Nawal Solo App , listening On port # : ${PORT}`));
    });
