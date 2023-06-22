/*****************************************
 * Author: Artin Lahni
 * Date: 06-09-2023
 * CS 290
*****************************************/

/*
**IMPORTANT**: This file uses nodemon experimental modules,
so it MUST be run with the --experimental-modules flag
Otherwise, **IT WILL NOT WORK**
*/

import express from 'express';
import 'dotenv/config';

import * as songController from './song-controller.mjs';

const PORT = process.env.PORT;
const app = express();
app.use(express.json());  // REST needs JSON MIME type.

app.use(express.static('public')); // Serve public folder

app.get('/', (req, res) => { // Redirect to index.html on startup
    res.redirect('/index.html');
});

// ---------- REST API ENDPOINTS ----------

// CREATE router
app.post ('/songs', songController.createSong);

// RETRIEVE router
app.get('/songs', songController.retrieveSongs);

// RETRIEVE by ID router
// -- UNUSED --
//app.get('/songs/:_id', songController.retrieveSongByID);

// DELETE router
app.put('/songs/:_id', songController.updateSong);

// UPDATE router
app.delete('/songs/:_id', songController.deleteSongById);


// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});