import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser'
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as database from './initialiseDB.js'
import * as ops from './databaseOps.js'
import * as movieDB from './movieDBConnection.js'


database.createAndInitialiseDB()

// Creates an instance of Express application.
const app = express();
const PORT = process.env.PORT || 8080;

// Converts import.meta.url into an absolute file path.
const __filename = fileURLToPath(import.meta.url);
// Derives the directory name 
const __dirname = dirname(__filename);

// Register Handlebars as the templating engine
app.engine('handlebars', engine());
// set the default view engine to Handlebar
app.set('view engine', 'handlebars');
// directory for  Handlebars templates 
app.set('views', './views');

app.set('port', 8080);
// Store static files from this directory
app.use(express.static(__dirname));

app.use(express.static(__dirname + '/views'));

// form data submitted through POST requests
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static("node_modules/bootstrap/dist"));



/* needed to access public assets */
app.use(express.static(__dirname + '/public'));
app.use(express.static("node_modules/bootstrap/dist"));


/* needed to access public assets */
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: false }));

// home page showing all students in database
app.get('/', async function (req, res) {
    let films = await ops.displayRecords()
    res.render('home', {
        films: films
    });
});

app.get('/films', async function (req, res) {
    let films = await ops.displayRecords()
    res.render('films', {
        films: films
    });
})

app.get('/sortedList/:column/:direction', async function (req, res) {
    //console.log('Request received:', req.params);
    let films = await ops.displaySortedRecords(req.params.column, req.params.direction)
    res.render('films', {
        films: films
    });
})

app.post('/search', async function (req, res) {
    //console.log(req.body.searchTerm)
    let errorMessage = "";
    let films = await ops.displaySearchedRecords(req.body.categories, req.body.searchTerm)
    if(films.length < 1){
        errorMessage = "NO RESULTS RETURNED"
    }
    res.render('search', {
        category: req.body.categories,
        searchTerm: req.body.searchTerm,
        films: films,
        errorMessage: errorMessage
    })
})

app.post('/specificFilm', async function (req, res) {
    //console.log(req.body.searchTerm)
    let film = await ops.displaySearchedRecords('rowid', req.body.id, ''); //  sending an empty string for equivalency to match exact film
    //console.log(film)
    res.render('specificFilm', {
        film: film
    })
})

app.post('/editFilm', async function (req, res) { //this one just takes them to the form to edit the movie
    let film = await ops.displaySearchedRecords('rowid', req.body.id, ''); //  sending an empty string for equivalency to match exact film
    res.render('editFilm', {film:film})
})

app.post('/updateFilm', async function (req, res) { //this one updates the record after they save changes on the form
    let filmExistCheck = await movieDB.checkFilmIDExists(req.body.img.trim())
    let imgPath = ""
    if(filmExistCheck){
        let film = await movieDB.getExactFilm(req.body.img.trim())
        imgPath = film.img
    }
    let filmObject = {
        title: req.body.title,
        img: imgPath,
        rating: req.body.rating,
        director: req.body.director,
        description: req.body.description,
        tagline: req.body.tagline,
        actors: req.body.actors,
        genre: req.body.genre,
        runtime: req.body.runtime,
        year: req.body.year
    };
    await ops.updateRecord(req.body.id, filmObject); //  sending id to use to update record and an object containing everything else

    res.redirect('/films'); //goes to the home page after finishing edit
})

app.post('/deleteFilm', async function (req, res) { 
    await ops.deleteRecord(req.body.id); 

    res.redirect('/films'); //goes to the home page after finishing delete
})

app.get('/createFilm', async function (req, res) { 
    //giving a blank film object because im reusing the code from the edit form so need to provide something to make it load
    let filmObject = {
        title: '',
        img: '',
        rating: '',
        director: '',
        description: '',
        tagline: '',
        actors: '',
        genre: '',
        runtime: '',
        year: ''
    };
    res.render('createFilm', {film:filmObject})
})

app.post('/createFilmRecord', async function (req, res) { 
    let filmExistCheck = await movieDB.checkFilmIDExists(req.body.img.trim())
    let imgPath = ""
    if(filmExistCheck){
        let film = await movieDB.getExactFilm(req.body.img.trim())
        imgPath = film.img
    }
    let filmObject = {
        title: req.body.title,
        img: imgPath,
        rating: req.body.rating,
        director: req.body.director,
        description: req.body.description,
        tagline: req.body.tagline,
        actors: req.body.actors,
        genre: req.body.genre,
        runtime: req.body.runtime,
        year: req.body.year
    };
    await ops.createRecord(filmObject); 

    res.redirect('/films'); //goes to the home page after finishing delete
})



app.get('/movieDB', async function (req, res) {
    res.render('movieDB')
});

app.post('/movieDB', async function (req, res) {
    let films = await movieDB.searchFilm(req.body.search)
    res.render('filmsMovieDBSearch', {films:films}) //shows a list of the films that get returned from your search
});

app.post('/addMovieDBFilm', async function (req, res) { //gets called when you click add To DB button from the extra page
    let film = await movieDB.getExactFilm(req.body.id)
    // create the new record for the chosen film
    await ops.createRecord(film)
    res.redirect('/films') //go back to films and added one should be at the bottom
});

app.get('/resetDatabase', async function (req, res) {
    await database.createAndInitialiseDB(); // Wipe + reset DB to original format
    res.redirect('/films'); // Back to film list
});



app.listen(PORT, function (req, res) {
    console.log('server running on port 8080');
});
