const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'), // import built in node modules fs and path
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    mongoose = require('mongoose');

const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
    // create a write stream (in append mode)
    // a 'log.txt' file is created in root directory
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'log.txt'), {flags: 'a'});


mongoose.connect('mongodb://localhost:27017/cfDB', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));


    app.use(express.static('public'));

     // GET requests READ
     app.get('/', (req, res) => {
        res.send('Welcome to my movie club!');
    });

    app.get('/documentation', (req, res) => {
        res.sendFile('public/documentation.html', { root: __dirname });
    });

    // Movie GET requests
  
    app.get('/movies', passport.authenticate('jwt', { session: false}), (req, res) => {
        Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });

    app.get('/movies/:title', passport.authenticate('jwt', { session: false}), (req, res) => {
        Movies.findOne({ Title: req.params.title })
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });

    app.get('/movies/genres/:genreName', passport.authenticate('jwt', { session: false}), (req, res) => {
        Movies.findOne({ 'Genre.Name': req.params.genreName })
        .then((movie) => {
            res.status(201).json(movie.Genre);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
    });

    app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false}), (req, res) => {
        Movies.findOne({ 'Director.Name': req.params.directorName })
        .then((movie) => {
            res.status(201).json(movie.Director);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
    });

    //GET all users
    app.get('/users', 
    passport.authenticate('jwt', { session: false}),
     (req, res) => {
        Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });

    //GET a user by username
    app.get('/users/:Username', passport.authenticate('jwt', { session: false}), (req, res) => {
        Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });


    //Add a user 
    /* We'll expect JSON in this format
    {
        ID: integer,
        Username: String,
        Password: String,
        Email: String,
        Birthday: Date
    }*/
    app.post('/users', (req, res) => {
        Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                .create({
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                })
                .then((user) => {res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
    });

        // Add a movie to a user's list of favourites
        app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
            Users.findOneAndUpdate({ Username: req.params.Username }, {
                $push: { FavouriteMovies: req.params.MovieID },
            },
            { new: true } // This line makes sure that the updated document is returned
            )
            .then((updatedUser) => {
                if(!updatedUser) {
                    return res.status(400).send('Error: User was not found');
                } else {
                    res.json(updatedUser);
                }
            })
            .catch((error) => {
                console.error(error);
            });
        });

    // PUT requests UPDATE

    // Update a user's info, by username
    /* We'll expect JSON in this format
    {
        Username: String,
        (required)
        Passsword : String,
        (required)
        Email: String,
        (required)
        Birthday: Date
    }*/
    app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
        Users.findOneAndUpdate(
            { Username: req.params.Username }, 
            { $set: {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        },
      },
      { new: true }, // This line makes sure that the updated document is returned
        )
    //     .then((user) => {
    //         if(!user) {
    //             return res.status(400).send('Error: No user was found');
    //         } else {
    //             res.json(user);
    //         }
    //     })
    //     .catch((err) => {
    //         console.error(err);
    //         res.status(500).send('Error: ' + err);
    //     });
    // });
            .then((updatedUser) => res.status(200).json(updatedUser))
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
        });  


    //DELETE requests

    //Delete a movie from a users favourite movies list
    app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
        Users.findOneAndUpdate(
            { Username: req.params.Username },
            {
                $pull: { FavouriteMovies: req.params.MovieID }
            },
            { new: true }
            )
        .then((updatedUser) => {
            if(!updatedUser) {
                res.status(400).send(req.params.MovieID + ' was not found');
            } else {
                res.status(200).send(req.params.movieID + ' was deleted');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' +err);
        });
    });

    // Delete a user by username
    app.delete('/users/:Username', (req, res) => {
        Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });



    app.use((err,req,res,next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!')
    });

    //Listen for requests
    app.listen(8080, () => {
        console.log('Your app is listening to port 8080.');
    });
