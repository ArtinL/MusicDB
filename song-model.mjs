/*****************************************
 * Author: Artin Lahni
 * Date: 06-09-2023
 * CS 290
*****************************************/

// NOTE: This file was modified from an example from the class
// Every method is changed, so apart from the structure, it is essentially my own

// Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';

// Connect based on the .env file parameters.
mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);
const db = mongoose.connection;

// Confirm that the database has connected and print a message in the console.
db.once("open", (err) => {
    if(err){
        res.status(500).json({ error: '500:Connection to the server failed.' });
    } else  {
        console.log('Successfully connected to MongoDB Songs collection using Mongoose.');
    }
});

// SCHEMA: Define the collection's schema.
// title, artist, released, popularity, genre 
const songSchema = mongoose.Schema({
	title: { type: String, required: true },
    artist: { type: String, required: true },
    released: { type: Date, required: true },
    popularity: { type: Number, required: true },
    genre: { type: [String], required: true }
});

// Compile the model from the schema.
const Song = mongoose.model('Song', songSchema);


// CREATE model *****************************************
export async function createSong(payload) {
    const song = new Song(payload);
    return song.save();
}


// RETRIEVE models *****************************************
export async function retrieveSongs(q) {
    const query = Song.find(q);
    return query.exec();
}

// RETRIEVE by ID *****************************************

// -- UNUSED -- 
export async function retrieveSongByID(_id) {
    const query = Song.findById({_id: _id});
    return query.exec();
}

// DELETE model based on _id  *****************************************
export async function deleteSongById(_id) {
    const result = await Song.deleteOne({_id: _id});
    return result.deletedCount;
};


// UPDATE model *****************************************************
export async function updateSong(payload) {
    const result = await Song.replaceOne({_id: payload._id }, payload);
    return payload;

}
