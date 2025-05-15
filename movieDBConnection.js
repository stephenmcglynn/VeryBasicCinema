import { MovieDb } from "moviedb-promise";
const API_KEY = process.env.API_KEY;
const moviedb = new MovieDb(API_KEY)
const imagePathStart = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2' //found from experimenting with the site, this plus the poster path returned from search leads to the photo

export async function searchFilm(filmName){
    let films = await moviedb.searchMovie(filmName)
    let filmsList = films.results;
    //console.log(filmsList)
    let editedFilmsList = []
    for(let film of filmsList){ //only some of the fields are shown in a general search so i take them
        let newFilm = {
            title: film.title,
            img: imagePathStart + film.poster_path,
            id: film.id,
            description: film.overview,
            year: film.release_date.substring(0,4)
        };
        editedFilmsList.push(newFilm)
    }
    return editedFilmsList
}

export async function getExactFilm(id){
    let exactMovie = await moviedb.movieInfo(id)
    let newFilm = {
        title: exactMovie.title,
        img: imagePathStart + exactMovie.poster_path,
        rating: '', //the api doesnt return the rating, direcotr or actors so i leave them blank
        director: '',
        description: exactMovie.overview,
        tagline: exactMovie.tagline,
        actors: '',
        genre: exactMovie.genres?.[0]?.name || '', //the genres is an array so i just get the name of the first one, ran into problems with some unknown films not having genres added the if to stop it crashing if it doesnt have one
        runtime: exactMovie.runtime,
        year: exactMovie.release_date.substring(0,4)
    };
    return newFilm
}



