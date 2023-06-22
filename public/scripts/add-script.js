/*****************************************
 * Author: Artin Lahni
 * Date: 06-09-2023
 * CS 290
*****************************************/

document.getElementById('addSongForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission to avoid reloading the page

    const form = event.target;
    const formData = new FormData(form);

    const genreInput = formData.get('genre');
    const genres = genreInput.split(/[,\s]+/); // Split the genre input using commas or spaces

    // create the song object from the fields
    const songData = {
        title: formData.get('title'),
        artist: formData.get('artist'),
        released: formData.get('dateReleased'),
        popularity: parseInt(formData.get('popularity')),
        genre: genres
    };

    console.log(songData);
    console.log(JSON.stringify(songData));

    try {
        // call the API endpoint using POST
        const response = await fetch('/songs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(songData)
        });

        if (response.ok) {
            const data = await response.json();
            // Handle the response data if needed
            console.log(data);
        } else {
            throw new Error('Request failed');
        }
    } catch (error) {
        // Handle any errors
        console.error(error);
    }

    form.reset();
});
