const express = require('express');
    morgan = require('morgan');
    fs = require('fs'), // import built in node modules fs and path
    path = require('path');

const app = express();
    // create a write stream (in append mode)
    // a 'log.txt' file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

let topMovies = [
    {
        title: 'Spirited Away',
        director: 'Hayao Miyakazi'
    },
    {
        title: 'Fantastic Mr. Fox',
        director: 'Wes Anderson'
    },
    {
        title: 'Fury',
        director: 'David Ayer'
    },
    {
        title: 'Southpaw',
        director: 'Antoine fuqua'
    },
    {
        title: 'Inglorious Basterds',
        director: 'Quentin Tarantino'
    },
    {
        title: 'Jurrasic Park',
        director: 'Steven Spielberg'
    },
    {
        title: 'The Thing',
        director: 'John Carpenter'
    },
    {
        title: 'Your Name',
        director: 'Makoto Shinkai'
    },
    {
        title: ''
    }
    
    ];

    app.use(express.static('public'));


    // GET requests
    app.get('/', (req, res) => {
        res.send('Welcome to my movie club!');
    });

    app.get('/documentation', (req, res) => {
        res.sendFile('public/documentation.html', { root: __dirname });
    });


    app.get('/movies', (req, res) => {
        res.json(topMovies);
    });

    app.use((err,req,res,next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!')
    })

    //Listen for requests
    app.listen(8080, () => {
        console.log('Your app is listening to port 8080.');
    });
