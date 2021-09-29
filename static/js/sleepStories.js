// tracks functions:
async function displaySleepStories(){
    const sleepStoriesData= await fetch('/getSleepStories').then((res) => res.json()) 
    if(sleepStoriesData.status === 200){
        const unauthorizedWarning=document.getElementById('unauthorizedWarning');
        unauthorizedWarning.style.display='none';
        if (sleepStoriesData.results == null) {
            sleepStoriesArr = [];
        }
        else {
            sleepStoriesArr =await sleepStoriesData.data.tracks;
        }
        console.log(sleepStoriesData.data.tracks);
        let sleepStoriesTable = document.getElementById("sleepStoriesTable");
        let html = "";
        await sleepStoriesArr.forEach(function(element, index){
            html +=`<tr class="tableRows">
                        <th id="itemID" scope="row">${element._id}</th>
                        <td>${element.title}</td>
                        <td>${element.artist}</td>
                        <td>${element.description}</td>
                        <td>${element.language}</td>
                        <td>${element.isPremium? "premium" : "normal"}</td>
                        <td><button class="btn btn-danger" onclick="deleteStory('${element._id}');">Delete</button></td>
                        <td>
                            <button type="button" class="btn btn-success" onclick="playTrack('${element._id}', '${element.title}', '${element.image_extention}', '${element.track_extention}');" data-bs-toggle="modal" data-bs-target="#playModal">
                                Play
                            </button>
                        </td>
                    </tr>`;
        });
        if (sleepStoriesArr.length != 0) {
            sleepStoriesTable.innerHTML = html;
        }
        if (sleepStoriesArr.length == 0) {
            const empty=document.getElementById('empty');
            empty.style.display='block';
        }
        const tracksCount=document.getElementById('tracksCount');
        tracksCount.innerText=`No.of results: ${sleepStoriesData.results}`
        let search = document.getElementById("sleepStoriesSearch");
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
displaySleepStories();

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
async function deleteStory(id){
    console.log(id);
    const result=await fetch(`/sleepStoryDelete/${id}`, {
        method:"DELETE"
    })
    if(result.status === 200){
        console.log('deleted');
        document.location.href='/sleepStories';
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
    trackImage.setAttribute('src', `/static/tracks/sleepStoryImages/${id}.${imgExt}`);
    audioPlayer.setAttribute('src', `/static/tracks/sleepStoryAudios/${id}.${trackExt}`);
}

window.addEventListener("load", function () {
    const loader = document.querySelector(".loader");
    loader.className += " hidden"; // class "loader hidden"
});