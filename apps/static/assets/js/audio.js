let songs 
let music = new Audio()
let firstSong 
async function fetchDataAndProcessSongs() {
    try {
        // Call fetchSongs() and await its result
        const songs = await fetchSongs();
        
        // Log the songs array
        console.log("songs ###", songs);
        
        // Access the first item in the songs array
        if (songs.length > 0) {
             firstSong = songs[0];
            console.log("First song:", firstSong);

            // Assuming each song object has a 'file_path' property, create a new Audio object
             music = new Audio(firstSong.src);
            console.log("music", music);
        }

        // Populate songs in HTML
        populateSongs(songs);
    } catch (error) {
        // Handle any errors that occur during fetching or processing
        console.error('Error:', error);
    }
}

// Call the function to fetch and process songs
fetchDataAndProcessSongs();

async function fetchSongs() {
    try {
        const response = await fetch('/api/songs');
        const data = await response.json();
       // Log the songs array
       
        populateSongs(data);
        return returnSongs(data);
    } catch (error) {
        console.error('Error fetching songs:', error);
    }
}

// Function to populate songs in the HTML
function populateSongs(songs) {
    const songsContainer = document.getElementById('songs-container');

    // Clear any existing content in the songs container
    songsContainer.innerHTML = '';

    // Iterate over the list of songs and create HTML elements for each song
    songs.forEach(song => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('songItem');

        const imgPlayDiv = document.createElement('div');
        imgPlayDiv.classList.add('img_play');

        const img = document.createElement('img');
        img.src = song.image_url; // Assuming each song object has an 'imageUrl' property
        img.classList.add('card-img');
        img.alt = song.title;

        const playIcon = document.createElement('i');
        playIcon.classList.add('fas', 'fa-play-circle'); // Assuming you're using Font Awesome
        playIcon.id = Math.random() * 1000000; // Assuming each song object has an 'id' property

        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = song.title; // Assuming each song object has a 'title' property

        const subtitle = document.createElement('div');
        subtitle.classList.add('subtitle');
        subtitle.textContent = song.artist || song.album || ''; // Assuming each song object has an 'info' property

        title.appendChild(document.createElement('br'));
        title.appendChild(subtitle);

        imgPlayDiv.appendChild(img);
        imgPlayDiv.appendChild(playIcon);
        card.appendChild(imgPlayDiv);
        card.appendChild(title);

        // Add event listener for playing the song
        playIcon.addEventListener('click', (e) => { 
            // Logic to set the selected song as the current playing song
            console.log("icon clicked to play ", song);
            index = e.target.id;
            makeAllPlays();
            e.target.classList.remove('fa-play-circle');
            e.target.classList.add('fa-pause-circle');
            music.src = song.src;
            poster_master_play.src =song.image_url;
            music.play();
            let song_title = songs.filter((ele)=>{
                return ele.id == index;
            })
    
            song_title.forEach(ele =>{
                let {title} = ele;
                title.innerHTML = title;
            })
            masterPlay.classList.remove('fa-play-circle');
            masterPlay.classList.add('fa-pause-circle');
            wave.classList.add('active2');
            music.addEventListener('ended',()=>{
                masterPlay.classList.add('fa-play-circle');
                masterPlay.classList.remove('fa-pause-circle');
                wave.classList.remove('active2');
            })
            makeAllBackgrounds();
            Array.from(document.getElementsByClassName('songItem'))[`${index-1}`].style.background = "rgb(105, 105, 170, .1)";music.addEventListener('ended',()=>{
            })
            // playSelectedSong(song);
        });

        songsContainer.appendChild(card);
    });
}

// Function to populate songs in the HTML
function returnSongs(songs) {
    let songs_array = [];
    // Iterate over the list of songs and create HTML elements for each song
    songs.forEach(song => {
        songs_array.push({
            id: Math.random() * 100000,
            title: `${song.title}`,
            artist: ` ${song.artist}`,
            album: ` ${song.album}`,
            image_url: `${song.image_url}`, 
            src: `${song.src}`
        });
    });
    return songs_array;
}

async function accessFirstSong() {
    // Call fetchSongs and await its result
    const songs = await fetchSongs();
    
    // Access the first item in the songs array
    const firstSong = songs[0];
    
    // Log the first song
    console.log("First song:", firstSong);
}

console.log("songs ###", songs)
if(firstSong ){
    music = new Audio(firstSong.file_path)
    console.log("music 2", music)
}
Array.from(document.getElementsByClassName('songItem')).forEach((element, i)=>{
    element.getElementsByTagName('img')[0].src = songs[i].image_url;
    //element.getElementsByTagName('h5')[0].innerHTML = songs[i].songName;
})


let masterPlay = document.getElementById('masterPlay');
console.log("masterPlay", masterPlay)
let wave = document.getElementsByClassName('wave')[0];

masterPlay.addEventListener('click',()=>{ 
    console.log("PLAY ICON CLICKED", music.currentSrc , "songs" )
    if (music.paused || music.currentTime <=0) {
        music.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        wave.classList.add('active2');
    } else {
        music.pause();
        masterPlay.classList.add('fa-play-circle');
        masterPlay.classList.remove('fa-pause-circle');
        wave.classList.remove('active2');
    }
} )


const makeAllPlays = () =>{
    Array.from(document.getElementsByClassName('playListPlay')).forEach((element)=>{
            element.classList.add('fa-play-circle');
            element.classList.remove('fa-pause-circle');
    })
}
const makeAllBackgrounds = () =>{
    Array.from(document.getElementsByClassName('songItem')).forEach((element)=>{
            element.style.background = "rgb(105, 105, 170, 0)";
    })
}

let index = 0;
let poster_master_play = document.getElementById('poster_master_play');
let title = document.getElementById('title');
Array.from(document.getElementsByClassName('playListPlay')).forEach((element)=>{
    element.addEventListener('click', (e)=>{
        console.log("eeeee" , e.target)
        index = e.target.id;
        makeAllPlays();
        e.target.classList.remove('fa-play-circle');
        e.target.classList.add('fa-pause-circle');
        music.src = `audio/${index}.mp3`;
        poster_master_play.src =`img/${index}.jpg`;
        music.play();
        let song_title = songs.filter((ele)=>{
            return ele.id == index;
        })

        song_title.forEach(ele =>{
            let {songName} = ele;
            title.innerHTML = songName;
        })
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        wave.classList.add('active2');
        music.addEventListener('ended',()=>{
            masterPlay.classList.add('fa-play-circle');
            masterPlay.classList.remove('fa-pause-circle');
            wave.classList.remove('active2');
        })
        makeAllBackgrounds();
        Array.from(document.getElementsByClassName('songItem'))[`${index-1}`].style.background = "rgb(105, 105, 170, .1)";
    })
})


let currentStart = document.getElementById('currentStart');
let currentEnd = document.getElementById('currentEnd');
let seek = document.getElementById('seek');
let bar2 = document.getElementById('bar2');
let dot = document.getElementsByClassName('dot')[0];

music.addEventListener('timeupdate',()=>{
    let music_curr = music.currentTime;
    let music_dur = music.duration;

    let min = Math.floor(music_dur/60);
    let sec = Math.floor(music_dur%60);
    if (sec<10) {
        sec = `0${sec}`
    }
    currentEnd.innerText = `${min}:${sec}`;

    let min1 = Math.floor(music_curr/60);
    let sec1 = Math.floor(music_curr%60);
    if (sec1<10) {
        sec1 = `0${sec1}`
    }
    currentStart.innerText = `${min1}:${sec1}`;

    let progressbar = parseInt((music.currentTime/music.duration)*100);
    seek.value = progressbar;
    let seekbar = seek.value;
    bar2.style.width = `${seekbar}%`;
    dot.style.left = `${seekbar}%`;
})

seek.addEventListener('change', ()=>{
    music.currentTime = seek.value * music.duration/100;
})

music.addEventListener('ended', ()=>{
    masterPlay.classList.add('fa-play-circle');
    masterPlay.classList.remove('fa-pause-circle');
    wave.classList.remove('active2');
})


let vol_icon = document.getElementById('vol_icon');
let vol = document.getElementById('vol');
let vol_dot = document.getElementById('vol_dot');
let vol_bar = document.getElementsByClassName('vol_bar')[0];

vol.addEventListener('change', ()=>{
    if (vol.value == 0) {
        vol_icon.classList.remove('bi-volume-down-fill');
        vol_icon.classList.add('bi-volume-mute-fill');
        vol_icon.classList.remove('bi-volume-up-fill');
    }
    if (vol.value > 0) {
        vol_icon.classList.add('bi-volume-down-fill');
        vol_icon.classList.remove('bi-volume-mute-fill');
        vol_icon.classList.remove('bi-volume-up-fill');
    }
    if (vol.value > 50) {
        vol_icon.classList.remove('bi-volume-down-fill');
        vol_icon.classList.remove('bi-volume-mute-fill');
        vol_icon.classList.add('bi-volume-up-fill');
    }

    let vol_a = vol.value;
    vol_bar.style.width = `${vol_a}%`;
    vol_dot.style.left = `${vol_a}%`;
    music.volume = vol_a/100;
})



let back = document.getElementById('back');
let next = document.getElementById('next');

back.addEventListener('click', ()=>{
    index -= 1;
    if (index < 1) {
        index = Array.from(document.getElementsByClassName('songItem')).length;
    }
        // Extracting the poster and image src attributes
        const posterSrc = document.querySelector(`[data-index="${index}"]`);
        const imageSrc = document.querySelector(`[data-index="${index}"]`);
        console.log("posterSrc", posterSrc , "imageSrc", Array.from(document.getElementsByClassName('songItem'))[index])
        // poster_master_play.src = posterSrc;
        // // Assuming you want to set the poster for the music player too
        // music.poster = posterSrc;
    music.src = `audio/${index}.mp3`;
    poster_master_play.src =`img/${index}.jpg`;
    music.play();
    let song_title = songs.filter((ele)=>{
        return ele.id == index;
    })

    song_title.forEach(ele =>{
        let {songName} = ele;
        title.innerHTML = songName;
    })
    makeAllPlays()

    document.getElementById(`${index}`).classList.remove('fa-play-circle');
    document.getElementById(`${index}`).classList.add('fa-pause-circle');
    makeAllBackgrounds();
    Array.from(document.getElementsByClassName('songItem'))[`${index-1}`].style.background = "rgb(105, 105, 170, .1)";
    
})
next.addEventListener('click', (e)=>{
    index -= 0;
    index += 1;
    if (index > Array.from(document.getElementsByClassName('songItem')).length) {
        index = 1;
        }
    music.src = `audio/${index}.mp3`;
    poster_master_play.src =`img/${index}.jpg`;
    music.play();
    let song_title = songs.filter((ele)=>{
        return ele.id == index;
    })

    song_title.forEach(ele =>{
        let {songName} = ele;
        title.innerHTML = songName;
    })
    makeAllPlays()

    document.getElementById(`${index}`).classList.remove('fa-play-circle');
    document.getElementById(`${index}`).classList.add('fa-pause-circle');
    makeAllBackgrounds();
    Array.from(document.getElementsByClassName('songItem'))[`${index-1}`].style.background = "rgb(105, 105, 170, .1)";
    
})


// let left_scroll = document.getElementById('left_scroll');
// let right_scroll = document.getElementById('right_scroll');
// let pop_song = document.getElementsByClassName('pop_song')[0];

// left_scroll.addEventListener('click', ()=>{
//     pop_song.scrollLeft -= 330;
// })
// right_scroll.addEventListener('click', ()=>{
//     pop_song.scrollLeft += 330;
// })


// let left_scrolls = document.getElementById('left_scrolls');
// let right_scrolls = document.getElementById('right_scrolls');
// let item = document.getElementsByClassName('item')[0];

// left_scrolls.addEventListener('click', ()=>{
//     item.scrollLeft -= 330;
// })
// right_scrolls.addEventListener('click', ()=>{
//     item.scrollLeft += 330;
// })