/*****************************************
 * Author: Artin Lahni
 * Date: 06-09-2023
 * CS 290
*****************************************/


document.addEventListener('DOMContentLoaded', getData);
document.addEventListener('DOMContentLoaded', updateFilter);

// update button and delete button taken from DOM 
const deleteBtn = document.querySelector('#deleteBtn');
const updateBtn = document.querySelector('#updateBtn');

// adding event listeners to buttons
deleteBtn.addEventListener('click', deleteSong);
updateBtn.addEventListener('click', updateSong);

let selectBtn = []; // global array for all buttons on table

/**
 * @brief Fetches the song data from the server and displays it in the table
 * Aynschronous
 */
async function getData() {
    try {
        const response = await fetch('/songs');
        const songs = await response.json();
        displaySongs(songs);
    } catch (error) {
        console.log(error);
    }
}

/**
 * @brief Displays the song data in the table
 * 
 * @param {Array} songs
 * 
 */
function displaySongs(songs) {
    console.log('running displaySongs()');
    const tableBody = document.querySelector('#songTable tbody');

    // Clear the existing table rows
    tableBody.innerHTML = '';

    // create a new row for each song in the array of songs
    songs.forEach(song => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td id="_id">${song._id}</td>
        <td id="title">${song.title}</td>
        <td id="artist">${song.artist}</td>
        <td id="released">${formatDate(song.released)}</td>
        <td id="popularity">${song.popularity}</td>
        <td id="genre">${song.genre.join(', ')}</td>
        <td id="action"><button class="selectBtn">Select</button></td>
        `;

        // append the newly created row to the table body
        tableBody.appendChild(row);
        let btn = row.querySelector('button');
        btn.addEventListener('click', selectRow);
        selectBtn.push(btn); // add the new button to the array of buttons
    });
}

/**
 * @brief Formats the date to MM-DD-YYYY
 * Pads with 0 if needed
 */
function formatDate(date) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate() + 1).padStart(2, '0');
    const year = String(d.getFullYear());

    return `${month}-${day}-${year}`; // returns a string in the format MM-DD-YYYY
}

/**
 * @brief Selects the row that the button is in
 * 
 * @param {Event} event
 * 
 */
function selectRow(event) {
    //console.log('running selectRow()');
    const currRow = event.target.closest('tr');

    const rows = document.querySelectorAll('#songTable tr');
    rows.forEach(row => {
        if (currRow !== row) row.classList.remove('selectedRow');
    });

    currRow.classList.toggle('selectedRow'); // toggle the selectedRow class
}

/**
 * @brief Gets the song data from the selected row
 * 
 * @returns {Object} song
 * 
 */
function getSelectedSong() {
    //console.log('running getSelectedSong()');

    // get the selected row
    const selectedRow = document.querySelector('.selectedRow');
    if (selectedRow === null) {
        alert('Please select a song');
        return null;
    }

    // pulls the song data from the row HTML
    const song = {
        _id: selectedRow.querySelector('#_id').textContent,
        title: selectedRow.querySelector('#title').textContent,
        artist: selectedRow.querySelector('#artist').textContent,
        released: selectedRow.querySelector('#released').textContent,
        popularity: selectedRow.querySelector('#popularity').textContent,
        genre: selectedRow.querySelector('#genre').textContent.split(', ')
    };

    return song;
}

/**
 * @brief Deletes the selected song
 * Asynchronous call to the server
 * 
 * @returns {Object} song
 */
async function deleteSong() {
    const song = getSelectedSong();
    if (song === null) return; // nothing should happen if no song is selected

    const songId = song._id;

    try {
        const response = await fetch(`/songs/${songId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // reload to update the table
            location.reload();

        } else {
            throw new Error('Request failed');
        }
    }
    catch (error) {
        console.error(error);
    }

}

/** 
 * @brief Submits the update to the server
 * Asynchronous call to the server
 * 
 * @param {Event} event
 * 
 */
async function submitUpdate(event) {
    event.preventDefault();

    const songID = getSelectedSong()._id;
    const updateForm = document.querySelector('#updateForm');

    // gets newSong data from the update form
    const newSong = {
        _id: songID,
        title: updateForm.title.value,
        artist: updateForm.artist.value,
        released: updateForm.dateReleased.value,
        popularity: parseInt(updateForm.popularity.value),
        genre: updateForm.genre.value.split(/[,\s]+/)
    };

    try {
        // submit newSong to the server using PUT
        const response = await fetch(`/songs/${songID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSong)
        });

        if (response.ok) {
            location.reload();
        } else {
            throw new Error('Request failed');
        }

    } catch (error) {
        console.error(error);
    }


    updateForm.reset(); // reset the form
    updateFormContainer.classList.add('hidden');

}

/**
 * @brief Updates the selected song
 * 
 * @returns {Object} song
 */
async function updateSong() {
    const song = getSelectedSong();
    if (song === null) return;

    const songID = song._id;

    const updateFormContainer = document.querySelector('#updateFormContainer');
    const updateForm = document.querySelector('#updateForm');
    const updateBtn = document.querySelector('#updateBtn');

    // if the update form is hidden, display it
    if (updateFormContainer.classList.contains('hidden')) {
        // display selected song's data in the form fields
        updateForm.title.value = song.title;
        updateForm.artist.value = song.artist;
        updateForm.popularity.value = song.popularity;
        updateForm.genre.value = song.genre.join(', ');

        // show the form
        updateFormContainer.classList.remove('hidden');
        // change update button to cancel
        updateBtn.textContent = 'Cancel';
        // disable select buttons to ensure user can't swap mid update
        document.querySelectorAll('.selectBtn').forEach(btn => btn.disabled = true);

        // add the submit event listener to the form.
        updateForm.addEventListener('submit', submitUpdate);

    // if the form is already displayed, hide it
    } else {
        updateForm.reset();
        // remove event listener in case user selects a different song after cancel
        updateForm.removeEventListener('submit', submitUpdate);
        updateFormContainer.classList.add('hidden');

        // change update button back to update
        updateBtn.textContent = 'Update Selected';

        // re-enable select buttons
        document.querySelectorAll('.selectBtn').forEach(btn => btn.disabled = false);
    }


}

/**
 * @brief Gets all the unique genres from the server
 * 
 * @returns {Array} genres
 */
async function getUniqueGenres() {
    try {
        const response = await fetch('/songs');
        const songs = await response.json();

        // loop through every genre in every song
        const genres = songs.reduce((result, song) => {
            song.genre.forEach(genre => {
                if (!result.includes(genre)) { // if the genre is not already in the array, add it
                    result.push(genre);
                }
            });
            return result;
        }, []);

        return genres;
    } catch (error) {
        console.log(error);
        return [];
    }
}

/**
 * @brief Filters the table by genre by applying the hidden class
 * 
 * @param {String} filterParam
 * 
 */

function filterByGenre(filterParam) {
    const tableRows = document.querySelectorAll('#songTable tbody tr');

    tableRows.forEach(row => {
        const genreCell = row.querySelector('#genre');
        const genre = genreCell.textContent.toLowerCase();

        console.log(filterParam);
        // if the row doesn't include the genre filter, add hidden class to hide.
        if (!genre.includes(filterParam)) {
            row.classList.add('hidden');
        } else {
            // if the row does include the genre filter, remove hidden class to show.
            row.classList.remove('hidden');
        }

    });
}

/**
 * @brief Creates the genre dropdown
 * 
 * @param {Array} genres
 * 
 */
function createGenreDropdown(genres) {
    const genreDropdown = document.querySelector('#genreDropdown');

    genres.forEach(genre => {
        // for each unique genre, create the dropdown option
        const option = document.createElement('option');
        option.textContent = genre;
        genreDropdown.appendChild(option);
    });
}

function clearFilter() {
    const tableRows = document.querySelectorAll('#songTable tbody tr');

    // remove all filters currently applied.
    tableRows.forEach(row => {
        row.classList.remove('hidden');
    });
}

/**
 * @brief Updates the filter to display the new unique genres
 * 
 */
async function updateFilter() {
    const genres = await getUniqueGenres();
    //console.log(genres);
    createGenreDropdown(genres);

    const filterBtn = document.querySelector('#filterBtn');
    const clearBtn = document.querySelector('#clearBtn');

    // add the event listener to the filter and clear buttons
    filterBtn.addEventListener('click', () => {
        const selectedGenre = document.querySelector('#genreDropdown').value.toLowerCase();
        filterByGenre(selectedGenre);
        clearBtn.classList.remove('hidden');
    });

    clearBtn.addEventListener('click', () => {
        clearFilter();
        clearBtn.classList.add('hidden');
    });
}

