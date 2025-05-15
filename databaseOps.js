import * as database from './initialiseDB.js'


//https://cheatcode.co/blog/how-to-use-sqlite-with-node-js

//const db = new sqlite3.Database("movies.sqlite")

const query = (command, method = 'all') => {// method parameter, all returns all results of dataset, get returns first result, run just runs a statement e.g Insert INTO
    return new Promise((resolve, reject) => {//lets us use await to wait for it to be done efor ontinuing
      database.db[method](command, (error, result) => {
        if (error) {
          reject(error); // error will be returned
        } else {
          resolve(result); // success and program continues
        }
      });
    });
  };

export async function createRecord(film) {
  database.db.serialize(async () =>{
          const stmt = database.db.prepare('INSERT INTO movies VALUES (?,?,?,?,?,?,?,?,?,?)')
          stmt.run(film.img,film.rating,film.title,film.director, film.description,film.tagline,film.actors,film.genre, film.runtime, film.year)
          
          stmt.finalize()
      })
}


export async function displayRecords(){
    let records = await query('SELECT rowid, * FROM movies')
    return records;
}

export async function displaySortedRecords(column, direction){//direction is for ascending or descending, column is year or tile
  //console.log(`SELECT rowid, * FROM movies ORDER BY ${column} ${direction}`)
  let records = await query(`SELECT rowid, * FROM movies ORDER BY ${column} ${direction};`)
  return records;
}

export async function displaySearchedRecords(category, searchTerm, equivalency = '%'){// equivalency is a % by default so if they search gladiator, both 1 and 2 come up
  let records = await query(`SELECT rowid, * FROM movies WHERE ${category} like '${equivalency}${searchTerm}${equivalency}'`)
  return records;
}

export async function updateRecord(id, attributes){
  let stmt = database.db.prepare(`
    UPDATE MOVIES SET 
        title = ?, 
        img = ?, 
        rating = ?, 
        director = ?, 
        description = ?, 
        tagline = ?, 
        actors = ?, 
        genre = ?, 
        runtime = ?, 
        year = ? 
    WHERE rowid = ?
`);

let update = await stmt.run(
    attributes.title,
    attributes.img,
    attributes.rating,
    attributes.director,
    attributes.description,
    attributes.tagline,
    attributes.actors,
    attributes.genre,
    attributes.runtime,
    attributes.year,
    id
);
return update;

}

export async function deleteRecord(id){
  let deleted = await query(`DELETE FROM movies WHERE rowid = ${id};`, 'run')
  return deleted;
}







