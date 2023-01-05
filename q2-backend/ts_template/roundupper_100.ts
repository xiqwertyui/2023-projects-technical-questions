// import express, { query } from 'express';

import express, { json, Request, Response } from 'express';
import cors from 'cors';
// OPTIONAL: Use middleware to log (print to terminal) incoming HTTP requests
import morgan from 'morgan';

import {HOST, PORT} from './config.json'


// export const root = `${HOST}:${PORT}`;

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our amazing system
type location = { x: number, y: number };
type spaceCowboy = { name: string, lassoLength: number };
type spaceAnimal = { type: "pig" | "cow" | "flying_burger" };

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type spaceEntity =
    | { type: "space_cowboy", metadata: spaceCowboy, location: location }
    | { type: "space_animal", metadata: spaceAnimal, location: location };


// === ADD YOUR CODE BELOW :D ===

// === ExpressJS setup + Server setup ===
let spaceDatabase = [] as spaceEntity[];
const app = express();
// Use middleware that allows for access from other domains (needed for frontend to connect)
app.use(cors());
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// (OPTIONAL) Use middleware to log (print to terminal) incoming HTTP requests
app.use(morgan('dev'));


// // the POST /entity endpoint adds an entity to your global space database
app.post('/entity', (req, res) => {
    const { entities } = req.body;
    const jsonRes = dataBaseAdd(entities);
    console.log(spaceDatabase);
    return res.json(jsonRes);
});

// lasooable returns all the space animals a space cowboy can lasso given their name
app.get('/lassoable', (req, res) => {
    const cowboy_name = req.query.cowboy_name as string;  //http://localhost:8080/lassoable?cowboy_name=Bob
    return res.json(dataBaseGetLassoableAnimal(cowboy_name));
})

app.delete('/clear', (req, res) => {
    return res.json(clear());
})


/**
 * Start server
 */
const server = app.listen(PORT, () => {
    console.log(`Starting Express Server at the URL: '${HOST}:${PORT}'`);
  });
  
/**
 * Handle Ctrl+C gracefully
 */
process.on('SIGINT', () => {
server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
});
});


export function dataBaseAdd(entities: spaceEntity []) {
    spaceDatabase = spaceDatabase.concat(entities);   // simply add all incoming entities into the spaceDatabase
    return {};
}

export function dataBaseGetLassoableAnimal(cowBoyName: string) {
    const allCowBoyInfo = spaceDatabase.filter(entry=>entry.type === "space_cowboy") as { type: "space_cowboy", metadata: spaceCowboy, location: location } [];
    const cowBoyInfo = allCowBoyInfo.find(entry=>entry.metadata.name === cowBoyName) as { type: "space_cowboy", metadata: spaceCowboy, location: location };
    const space_animals = spaceDatabase
        .filter(entry=>entry.type === "space_animal")
        .filter(animalInfo=>isLassoable(cowBoyInfo.metadata.lassoLength, cowBoyInfo.location, animalInfo.location))
        .map((entry:{ type: "space_animal", metadata: spaceAnimal, location: location })=>{
            return {
                "type": entry.metadata.type,
                "location": entry.location
            };
        })
    return {space_animals};
}

export function isLassoable(cowBoyLassoLength: number, cowBoyLocation: location, animalLocation: location) : boolean {
    const distance = Math.sqrt((cowBoyLocation.x-animalLocation.x)**2+(cowBoyLocation.y-animalLocation.y)**2);
    return cowBoyLassoLength >= distance;
}

export function clear() {
    spaceDatabase = [];
    return {};
}