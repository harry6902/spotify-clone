let currentSong = new Audio();
let aa=0;
let songs;
let currFolder;
let cardContainer = document.querySelector(".cardContainer");
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`${folder}`);
    let b = await a.text();
    let div = document.createElement("div");
    div.innerHTML = b;
    let as = div.getElementsByTagName("a")
    songs = [];
    let songs2 = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            //songs.push(element.href);
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    console.log(songs[0]);
    playMusic(songs[0].replaceAll("%20", " "), true);
    //console.log(songs);
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="img/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Manepalli Hari</div>
        </div>
        <img class="invert" src="img/play.svg" alt="">
        </li>`;

    }


}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play()
    }
    // console.log(currentSong)
    if (pause) {
        play.src = "img/play.svg";
    }
    else {
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", " ");
    document.querySelector(".songDuration").innerHTML = "00:00/00:00";
}
function stoms(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60); // Round off to integers

    // Use string interpolation to format the output with leading zeros
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function displayAlbums() {
    let a = await fetch(`Songs`);
    let b = await a.text();
    let div = document.createElement("div");
    div.innerHTML = b;
    let anchors = div.getElementsByTagName("a");
    let arr = Array.from(anchors);
    //Array.from(anchors).forEach(async e => {
    for (let i = 0; i < arr.length; i++) {
        let e = arr[i];
        if (e.href.includes("/Songs") && !e.href.includes(".htaccess")) {
            let folder = (e.href.split("/").slice(-2)[0]);
            let xx = await fetch(`Songs/${folder}/info.json`)
            let yy = await xx.json();
            // console.log(yy);
            cardContainer.innerHTML = cardContainer.innerHTML +
                `  <div data-folder="${yy.title}" class="card">
               <div class="play">


                <svg width="35" height="35" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="22" height="22" rx="11" fill="#1fdf64" />
                    <path d="M16.5 12L9.5 17V7L16.5 12Z" fill="#000000" />
                </svg>
            </div>
            <img  src="/Songs/${folder}/picture.jpg" alt="">
                <h2> ${yy.title}</h2>
                    <p>${yy.description} </p>
         </div>`
        }
        //Load the playlist whenever the card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                //console.log(item.target,item.currentTarget.dataset);

                await getSongs(`Songs/${item.currentTarget.dataset.folder}`)
                aa=0;
                playMusic(songs[0]);

                Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
                    e.addEventListener("click", element => {
                        //console.log("hi ra")
                        //console.log(e.querySelector(".info").firstElementChild.innerHTML);
                        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
                    })

                })


            })
        })
    }

}

async function main() {
    await getSongs("Songs/Animal");

    //Display all the albums
    displayAlbums();



    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
           // console.log("hi ra")
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })

    })

    //Attach event listener for previous,next and play 
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    //Listen for time update
    
    currentSong.addEventListener("timeupdate", () => {
        // console.log(stoms(currentSong.currentTime),stoms(currentSong.duration));
        if(aa<1){
            document.querySelector(".songDuration").innerHTML = "00:00/00:00";
            aa++;
        }
        else{
        document.querySelector(".songDuration").innerHTML = `${stoms(currentSong.currentTime)} /${stoms(currentSong.duration)}`;
        }
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        console.log(e.offsetX);
        let percent = e.offsetX / e.target.getBoundingClientRect().width;
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        currentSong.currentTime = percent * (currentSong.duration);
    })

    //Add an event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })
    //Add an event listener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    //Add an event listener to next and previous
    previous.addEventListener("click", () => {
        aa=0;
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index > 0) {
            playMusic(songs[index - 1]);
        }
        else {
            alert("Previous song not available")
        }
    })
    next.addEventListener("click", () => {
        aa=0;
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log(songs);
        if (index < songs.length - 1) {
            playMusic(songs[index + 1]);
        }
        else {
            alert("Next song not available");
        }


    })

    //Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100;
        if(currentSong.volume>0){
            document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("img/mute.svg", "img/volume.svg");
        }
    })

    //Add an event listener to mute
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = "img/mute.svg";
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
            currentSong.volume = 0.2;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
        }
    })






}

main();  