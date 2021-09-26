const url='http://127.0.0.1:3000';
const sleepMusicId='614499d4dfc3482e180580db';
const sleepMysteriousId='614499f6dfc3482e180580dc';
const sleepStoryId='614499b6dfc3482e180580da';

// tracks functions:
async function displaySleepTracks(){
    const sleepTracksData= await fetch('/getSleepTracks').then((res) => res.json())
    const sleepStoriesData= await fetch('/getSleepStories').then((res) => res.json()) 
    if(sleepTracksData.status === 200){
        const unauthorizedWarning=document.getElementById('unauthorizedWarning');
        unauthorizedWarning.style.display='none';
        if (sleepTracksData.results == null || sleepStoriesData.results == null) {
            sleepTracksArr = [];
        }
        else {
            sleepTracksArr =await sleepTracksData.data.tracks;
            sleepStoriesData.data.tracks.forEach(element => {
                sleepTracksArr.push(element);
            });
        }
        console.log(sleepTracksArr);
        console.log(sleepStoriesData.data.tracks);
        let sleepTracksTable = document.getElementById("sleepTracksTable");
        let html = "";
        await sleepTracksArr.forEach(function(element, index){
            var category=[];
            if(element.category_id.includes(sleepMusicId)){
                category.push("Music")
            }
            if(element.category_id.includes(sleepStoryId)){
                category.push("Stories")
            }
            if(element.category_id.includes(sleepMysteriousId)){
                category.push("Mysterious")
            }
            console.log(category);
            if(category.includes('Stories')){
                html +=`<tr class="tableRows">
                            <th id="itemID" scope="row">${element._id}</th>
                            <td>${element.title}</td>
                            <td>${category}</td>
                            <td>${element.artist}</td>
                            <td>${element.description}</td>
                            <td>${element.isPremium? "premium" : "normal"}</td>
                            <td><button class="btn btn-danger" onclick="deleteStory('${element._id}');">Delete</button></td>
                            <td>
                                <button type="button" class="btn btn-success" onclick="playTrack('${element._id}', '${element.title}', '${element.image_extention}', '${element.track_extention}');" data-bs-toggle="modal" data-bs-target="#playModal">
                                    Play
                                </button>
                            </td>
                        </tr>`;
            }
            if(category.includes('Music') || category.includes('Mysterious')){
                html += `<tr class="tableRows">
                            <th id="itemID" scope="row">${element._id}</th>
                            <td>${element.title}</td>
                            <td>${category}</td>
                            <td>${element.artist}</td>
                            <td>${element.description}</td>
                            <td>${element.isPremium? "premium" : "normal"}</td>
                            <td><button class="btn btn-danger" onclick="deleteTrack('${element._id}');">Delete</button></td>
                            <td>
                                <button type="button" class="btn btn-success" onclick="playTrack('${element._id}', '${element.title}', '${element.image_extention}', '${element.track_extention}');" data-bs-toggle="modal" data-bs-target="#playModal">
                                    Play
                                </button>
                            </td>
                        </tr>`;
            }      
        });
        if (sleepTracksArr.length != 0) {
            sleepTracksTable.innerHTML = html;
        }
        if (sleepTracksArr.length == 0) {
            const empty=document.getElementById('empty');
            empty.style.display='block';
        }
        const tracksCount=document.getElementById('tracksCount');
        tracksCount.innerText=`No.of results: ${sleepTracksData.results + sleepStoriesData.results}`
        let search = document.getElementById("sleepTracksSearch");
        search.addEventListener("input", function () {
            let searchValue = search.value;
            let results = document.getElementsByClassName("tableRows");
            Array.from(results).forEach(function (element) {
                let cardTxt = element.getElementsByTagName("th")[0].innerText;
                cardTxt += element.getElementsByTagName("td")[0].innerText;
                cardTxt += element.getElementsByTagName("td")[1].innerText;
                cardTxt += element.getElementsByTagName("td")[2].innerText;
                cardTxt += element.getElementsByTagName("td")[3].innerText;
                cardTxt += element.getElementsByTagName("td")[4].innerText;
                if (cardTxt.toLowerCase().includes(searchValue.toLowerCase())) {
                    element.style.display = "";
                }
                else {
                    element.style.display = "none";
                }
            });
        });
    }
}
displaySleepTracks();

// const addLessonBtn = document.getElementById('addLessonBtn');
// const lesson = document.getElementById('lesson');
// const timeStamp = document.getElementById('timeStamp');
// const lessonsTable = document.getElementById('lessonsTable');
// addLessonBtn.addEventListener('click', async ()=>{
//     const lessonValue=lesson.value;
//     const timeStampValue=timeStamp.value;
//     lessonsTable.innerHTML += `<tr>
//                                 <td>${lessonValue}</td>
//                                 <td>${timeStampValue}</td>
//                                </tr>`
// })

// CRUD functions
async function deleteTrack(id){
    console.log(id);
    const result=await fetch(`/sleepTrackDelete/${id}`, {
        method:"DELETE"
    })
    if(result.status === 200){
        console.log('deleted');
        document.location.href='/sleepTracks';
    }
    else if (result.status === 400){
        alert("Something went wrong! please try again");
    }
}

// CRUD functions
async function deleteStory(id){
    console.log(id);
    const result=await fetch(`/sleepStoryDelete/${id}`, {
        method:"DELETE"
    })
    if(result.status === 200){
        console.log('deleted');
        document.location.href='/sleepTracks';
    }
    else if (result.status === 400){
        alert("Something went wrong! please try again");
    }
}

//playTrack
const trackTitle=document.getElementById('trackTitle');
const trackImage=document.getElementById('trackImage');
const audioPlayer=document.getElementById('audioPlayer');
async function playTrack(id, title, imgExt, trackExt){
    trackTitle.innerText=title;
    trackImage.setAttribute('src', `/static/tracks/sleepImages/${id}.${imgExt}`);
    audioPlayer.setAttribute('src', `/static/tracks/sleepTracks/${id}.${trackExt}`);
}

window.addEventListener("load", function () {
    const loader = document.querySelector(".loader");
    loader.className += " hidden"; // class "loader hidden"
});