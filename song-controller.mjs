/*****************************************
 * Author: Artin Lahni
 * Date: 06-09-2023
 * CS 290
*****************************************/


// NOTE: This file was modified from an example from the class
// Every method is changed, so apart from the structure, it is essentially my own
// Namely, I changed every promise to a async/await function, removed the router from the file, 
// and exported each function directly as opposed to a series of anonymous functions.

import * as songs from './song-model.mjs'

// CREATE controller
export async function createSong(req,res) { 
    try {
        const song = await songs.createSong(req.body);
        res.status(201).json(song);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'create a document failed' });
    }
    
}

// RETRIEVE controller
export async function retrieveSongs(req,res) {
    try {
        const song = await songs.retrieveSongs({});
        res.json(song);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'retrieve document failed' });
    }
}

// RETRIEVE by ID controller 
// -- UNUSED --
export async function retrieveSongByID(req,res) {
    try {
        const song = await songs.retrieveSongByID(req.params._id);
        if (song !== null) {
            res.json(song);
        } else {
            res.status(404).json({ Error: 'document not found' });
        }         
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ Error: 'retrieve document failed' });
    }
}



// NOTE: This file was modified from an example from the class
// Every method is changed, so apart from the structure, it is essentially my own

// DELETE controller
export async function deleteSongById(req,res) { 
    try {
        const song = await songs.deleteSongById(req.params._id);
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'delete a document failed' });
    }
}

// UPDATE controller
export async function updateSong(req,res) {
    try {
        const song = await songs.updateSong(req.body);
        res.json(song);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'update a document failed' });
    }
}