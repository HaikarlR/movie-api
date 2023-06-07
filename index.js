const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'), // import built in node modules fs and path
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();
    // create a write stream (in append mode)
    // a 'log.txt' file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json());

let users = [
    { 
        id: 1,
        name: 'Ken',
        favouriteMovies: []
    },
    {
        id: 2,
        name: 'Cam',
        favouriteMovies:['Paddington']
    },
]

let movies = [
    {
        Title: 'Spirited Away',
        Director: { 
            Name: 'Hayao Miyazaki',
            Bio: 'A co-founder of Studio Ghibli, he has attained international acclaim as a masterful storyteller and creator of Japanese animated feature films, and is widely regarded as one of the most accomplished filmmakers in the history of animation.',
            Birthyear: '1941',
            Deathyear: 'none'
        },
        Genre: { 
            Name:'Fantasy',
            Description: 'speculative fiction involving magical elements, typically set in a fictional universe and sometimes inspired by mythology and folklore.' 
        }
    },
    {
        Title: 'Fantastic Mr. Fox',
        Director: {
            Name: 'Wes Anderson',
            Bio: 'Wesley Wales Anderson is an American filmmaker. His films are known for their eccentricity, unique visual and narrative styles, and frequent use of ensemble casts. They often contain themes of grief, loss of innocence, and dysfunctional families.',
            Birthyear: '1969',
            Deathyear: 'None'
        },
        Genre: { 
            Name: 'Comedy',
            Description:'Fiction that consists of discourses or works intended to be humorous or amusing.'
        }
    },
    {
        Title: 'Fury',
        Director: { 
            Name:'David Ayer',
            Bio: 'An American filmmaker known for making crime films that are set in Los Angeles and deal with gangs and police corruption. ',
            Birthyear: '1968',
            Deathyear: 'none'
        },
        Genre: { 
            Name: 'War',
            Description: 'War film set in times of war.'  }
    },
    {
        Title: 'Southpaw',
        Director: { 
            Name:'Antoine fuqua',
            Bio: 'An American filmmaker, known for his work in the action and thriller genres.',
            Birthyear: '1965',
            Deathyear: 'none'
        },
        Genre: { 
            Name: 'Drama',
            Description: 'Stories with high stakes and many conflicts.'
        }
    },
    {
        Title: 'Inglorious Basterds',
        Director: { 
            Name:'Quentin Tarantino',
            Bio: ' His films are characterized by stylized violence, extended dialogue including a pervasive use of profanity, and references to popular culture.',
            Birthyear: '1963',
            Deathyear: 'none'
        },
        Genre: { 
            Name: 'Dark comedy',
            Description: 'A style of comedy that makes light of subject matter that is generally considered taboo, particularly subjects that are normally considered serious or painful to discuss.'
        }
    },
    {
        Title: 'Jurrasic Park',
        Director: { 
            Name:'Steven Spielberg',
            Bio: 'A style of filmmaking is based on three elements: storytelling, character development, and suspense. Spielberg knows how to tell a story in such a way that it will leave you wanting more after every scene.',
            Birthyear: '1946',
            Deathyear: 'none'
        },
        Genre: { 
            Name:'Science fiction',
            Description: 'A genre that speculates about alternative ways of life made possible by technological change.'
        }
    },
    {
        Title: 'The Thing',
        Director: { 
            Name:'John Carpenter',
            Bio: 'An American filmmaker, actor, and composer. Although he has worked in various film genres, he is most commonly associated with horror, action, and science fiction films of the 1970s and 1980s.',
            Birthyear: '1948',
            Deathyear: 'none'
        },
        Genre: { 
            Name: 'Horror',
            Description: 'A genre of literature, film, and television that is meant to scare, startle, shock, and even repulse audiences.'
        }
    },
    {
        Title: 'Your Name',
        Director: { 
            Name:'Makoto Shinkai',
            Bio: 'While anime and anime films often cater to the genre of fantasy and speculative fiction, his films explore the space between realism and fiction.',
            Birthyear: '1973',
            Deathyear: 'none'
        },
        Genre: { 
            Name: 'Romance',
            Description: 'A genre that involves a mysterious, adventurous, or spiritual story line where the focus is on a quest that involves bravery and strong values, not always a love interest.'

        }
    },
    {
        Title: 'Spiderman 2',
        Director: { 
            Name:'Sam Raimi',
            Bio: 'His distinctive style is usually a blend of horror and comedy in varying degrees, his effective use of montages, and his camera work that you can tell is a Raimi movie at a glance.',
            Birthyear: '1959',
            Deathyear: 'none'
        },
        Genre : { 
            Name: 'Superhero',
            Description: 'A genre of speculative fiction examining the adventures, personalities and ethics of costumed crime fighters known as superheroes, who often possess superhuman powers and battle similarly powered criminals known as supervillains.'
        }
    },
    {
        Title: 'Nope',
        Director: { 
            Name:'Jordan Peele',
            Bio: 'An American actor, comedian, and filmmaker. He is best known for his film and television work in the comedy and horror genres.',
            Birthyear: '1979',
            Deathyear: 'none'
        },
        Genre: { 
            Name: 'Mystery', 
            Description: 'A genre where the nature of an event remains mysterious until the end of the story.' 
        }   
    },
    
    ];

    app.use(express.static('public'));

     // GET requests READ
     app.get('/', (req, res) => {
        res.send('Welcome to my movie club!');
    });

    app.get('/documentation', (req, res) => {
        res.sendFile('public/documentation.html', { root: __dirname });
    });

    // Movie GET requests
    app.get('/movies', (req, res) => {
        res.json(movies);
    });

    app.get('/movies/:title', (req, res) => {
        const { title } = req.params;
        const movie = movies.find( movie => movie.Title === title );

        if (movie) {
            res.status(200).json(movie);
        } else {
            res.status(400).send('movie does not exist')
        }
    });

    app.get('/movies/genre/:genreName', (req, res) => {
        const { genreName } = req.params;
        const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

        if (genre) {
            res.status(200).json(genre);
        } else {
            res.status(400).send('genre does not exist')
        }
    });

    app.get('/movies/directors/:directorName', (req, res) => {
        const { directorName } = req.params;
        const director = movies.find( movie => movie.Director.Name === directorName ).Director;

        if (director) {
            res.status(200).json(director);
        } else {
            res.status(400).send('director does not exist')
        }
    });


    //User GET requests
    app.get('/users', (req, res) => {
        res.json(users);
    });

    app.get('/users/:userName', (req, res) => {
        const { userName } = req.params;
        const user = users.find( user => user.name === userName );

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).send('user does not exist')
        }
    });


    // POST requests CREATE
    app.post('/users', (req,res) => {
        const newUser = req.body;

        if (newUser.name) {
            newUser.id = uuid.v4();
            users.push(newUser);
            res.status(201).json(newUser)
        } else {
            res.status(400).send('new user need names')
        }
    });

    app.post('/users/:id/:movieTitle', (req, res) => {
        const { id, movieTitle } =req.params;

        let user = users.find( user => user.id == id);

        if (user) {
            user.favouriteMovies.push(movieTitle);
            res.status(200).send('${movieTitle} has been added to user ${id}`s array');
        } else {
            res.status(400).send('no user exists')
        }
    });

    // PUT requests UPDATE
    app.put('/users/:id', (req, res) => {
        const { id } =req.params;
        const updatedUser = req.body;

        let user = users.find( user => user.id == id);

        if (user) {
            user.name = updatedUser.name;
            res.status(200).json(user);
        } else {
            res.status(400).send('no user exists')
        }
    });


    //DELETE requests
    app.delete('/users/:id/:movieTitle', (req, res) => {
        const { id, movieTitle } =req.params;

        let user = users.find( user => user.id == id);

        if (user) {
            user.favouriteMovies = user.favouriteMovies.filter( title => title !== movieTitle);
            res.status(200).send('${movieTitle} has been removed from user ${id}`s array');
        } else {
            res.status(400).send('no user exists')
        }
    });

    app.delete('/users/:id', (req, res) => {
        const { id } =req.params;

        let user = users.find( user => user.id == id);

        if (user) {
            users = users.filter( user => user.id != id);
            res.status(200).send('user ${id} has been deleted');
        } else {
            res.status(400).send('no user exists')
        }
    });



    app.use((err,req,res,next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!')
    });

    //Listen for requests
    app.listen(8080, () => {
        console.log('Your app is listening to port 8080.');
    });
