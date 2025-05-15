import sqlite3 from 'sqlite3';
import * as ops from './databaseOps.js'

export const db = new sqlite3.Database("movies.sqlite");

export function createAndInitialiseDB() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('DROP TABLE IF EXISTS movies')
            db.run(`CREATE TABLE MOVIES (
            img TEXT,
            rating TEXT,
            title VARCHAR(50),
            director VARCHAR(50),
            description TEXT,
            tagline TEXT,
            actors TEXT,
            genre TEXT,
            runtime DECIMAL(3,0),
            year DECIMAL(4,0)
        );`)

            const stmt = db.prepare('INSERT INTO movies VALUES (?,?,?,?,?,?,?,?,?,?)')
            stmt.run('/images/gladiatorPoster.jpg', '15A', 'Gladiator', 'Ridley Scott',
                `After the death of Emperor Marcus Aurelius, his devious son takes power and demotes Maximus, one of Rome's most capable generals who Marcus preferred. Eventually, Maximus is forced to become a gladiator and battle to the death against other men for the amusement of paying audiences.`,
                'What we do in life echoes in eternity.', 'Russell Crowe,Joaquin Phoenix', 'Drama', 155, 2000);

            stmt.run('/images/gladiator2Poster.jpg', '15A', 'Gladiator II', 'Ridley Scott',
                'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist. With rage in his heart and the future of the Empire at stake, Lucius must look to his past to find strength and honor to return the glory of Rome to its people.',
                'Prepare to be entertained.', 'Paul Mescal,Denzel Wwashington', 'Drama', 148, 2024);

            stmt.run('/images/theEqualizerPoster.jpg', '18', 'The Equalizer', 'Antoine Fuqua',
                'McCall believes he has put his mysterious past behind him and dedicated himself to beginning a new, quiet life. But when he meets Teri, a young girl under the control of ultra-violent Russian gangsters, he can’t stand idly by – he has to help her. Armed with hidden skills that allow him to serve vengeance against anyone who would brutalize the helpless, McCall comes out of his self-imposed retirement and finds his desire for justice reawakened. If someone has a problem, if the odds are stacked against them, if they have nowhere else to turn, McCall will help. He is The Equalizer.',
                'What do you see when you look at me?', 'Denzel Washington,Chloë Grace Moretz', 'Action', 132, 2014);

            stmt.run('/images/rockyPoster.jpg', '12', 'Rocky', 'John G. Avildsen',
                'An uneducated collector for a Philadelphia loan shark is given a once-in-a-lifetime opportunity to fight against the world heavyweight boxing champion.',
                'His whole life was a million-to-one shot.', 'Sylvester Stallone,Talia Shire', 'Sport', 120, 1976);

            stmt.run('/images/goodfellasPoster.jpg', '18', 'Goodfellas', 'Martin Scorcese',
                'The true story of Henry Hill, a half-Irish, half-Sicilian Brooklyn kid who is adopted by neighbourhood gangsters at an early age and climbs the ranks of a Mafia family under the guidance of Jimmy Conway.',
                'Three decades of life in the mafia.', 'Robert De Niro,Ray Liotta', 'Drama', 145, 1990);

            stmt.run('/images/inceptionPoster.jpg', '12A', 'Inception', 'Christopher Nolan',
                `Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person's idea into a target's subconscious.`,
                `Your mind is the scene of the crime.`, 'Leonardo DiCaprio,Joseph Gordon-Levitt', 'Sci-Fi', 148, 2010);

            stmt.run('/images/interstellarPoster.jpg', '12A', 'Interstellar', 'Christopher Nolan',
                `The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.`,
                `Mankind was born on Earth. It was never meant to die here.`, 'Matthew McConaughey,Anne Hathaway', 'Sci-Fi', 169, 2014);

            stmt.run('/images/jurassicParkPoster.jpg', '12', 'Jurassic Park', 'Steven Spielberg',
                `A wealthy entrepreneur secretly creates a theme park featuring living dinosaurs drawn from prehistoric DNA. Before opening day, he invites a team of experts and his two eager grandchildren to experience the park and help calm anxious investors. However, the park is anything but amusing as the security systems go off-line and the dinosaurs escape.`,
                `An adventure 65 million years in the making.`, 'Sam Neill,Laura Dern', 'Adventure', 127, 1993);

            stmt.run('/images/parasitePoster.jpg', '16', 'Parasite', 'Bong Joon Ho',
                `All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.`,
                'Act like you own the place.', 'Song Kang-ho,Lee Sun-kyun', 'Thriller', 132, 2019);

            stmt.run('/images/theDarkKnightPoster.jpg', '15A', 'The Dark Knight', 'Christopher Nolan',
                'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
                'Welcome to a world without rules.', 'Christian Bale,Heath Ledger', 'Action', 152, 2008);


            stmt.finalize((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
}






