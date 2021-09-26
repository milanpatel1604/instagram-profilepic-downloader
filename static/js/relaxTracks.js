const url='http://127.0.0.1:3000';
const relaxBeginnersId='61449a1adfc3482e180580dd';
const relaxSelfCalmId='61449a24dfc3482e180580de';

// tracks functions:
async function displayRelaxTracks(){
    const relaxTracksData= await fetch('/getRelaxTracks').then((res) => res.json())
    const relaxMelodySoundsData= await fetch('/getRelaxMelodySounds').then((resp) => resp.json())
    if(relaxTracksData.status === 200){
        const unauthorizedWarning=document.getElementById('unauthorizedWarning');
        unauthorizedWarning.style.display='none';
        if (relaxTracksData.results == null || relaxMelodySoundsData.results == null) {
            relaxTracksArr = [];
        }
        else {
            relaxTracksArr =await relaxTracksData.data.tracks;
            relaxMelodySoundsData.data.tracks.forEach(element => {
                relaxTracksArr.push(element);
            });
        }
        console.log(relaxTracksArr);
        console.log(relaxMelodySoundsData.data.tracks);
        let relaxTracksTable = document.getElementById("relaxTracksTable");
        let html = "";
        await relaxTracksArr.forEach(function(element, index){
            const soundCategory=['Nature', 'Musical', 'Other'];
            if(soundCategory.includes(element.sound_category)){
                html += `<tr class="tableRows">
                            <th id="itemID" scope="row">${element._id}</th>
                            <td>${element.sound_title}</td>
                            <td>${element.sound_category}</td>
                            <td> - </td>
                            <td> - </td>
                            <td>normal</td>
                            <td><button class="btn btn-danger" onclick="deleteSound('${element._id}');">Delete</button></td>
                            <td>
                            <audio controls id="audioPlayer" src="http://127.0.0.1:3000/static/tracks/relaxTracks/${element._id}.${element.track_extention}" type="audio/mpeg"></audio>
                            </td>
                        </tr>`;
            }
            if(!element.sound_category){
                var category=[];
                if(element.category_id.includes(relaxBeginnersId)){
                    category.push("Beginners")
                }
                if(element.category_id.includes(relaxSelfCalmId)){
                    category.push("Self-Calm")
                }
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
        if (relaxTracksArr.length != 0) {
            relaxTracksTable.innerHTML = html;
        }
        if (relaxTracksArr.length == 0) {
            const empty=document.getElementById('empty');
            empty.style.display='block';
        }
        const tracksCount=document.getElementById('tracksCount');
        tracksCount.innerText=`No.of results: ${relaxTracksData.results + relaxMelodySoundsData.results}`
        let search = document.getElementById("relaxTracksSearch");
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
displayRelaxTracks();


// CRUD functions
async function deleteTrack(id){
    console.log(id);
    const result=await fetch(`/relaxTrackDelete/${id}`, {
        method:"DELETE"
    })
    if(result.status === 200){
        document.location.href='/relaxTracks';
    }
    else if (result.status === 400){
        console.log("Something went wrong! please try again");
    }
}
async function deleteSound(id){
    console.log(id);
    const result=await fetch(`/relaxMelodySoundDelete/${id}`, {
        method:"DELETE"
    })
    if(result.status === 200){
        document.location.href='/relaxTracks';
    }
    else if (result.status === 400){
        console.log("Something went wrong! please try again");
    }
}

//playTrack
const trackTitle=document.getElementById('trackTitle');
const trackImage=document.getElementById('trackImage');
const audioPlayer=document.getElementById('audioPlayer');
async function playTrack(id, title, imgExt, trackExt){
    trackTitle.innerText=title;
    trackImage.setAttribute('src', `/static/tracks/relaxImages/${id}.${imgExt}`);
    audioPlayer.setAttribute('src', `/static/tracks/relaxTracks/${id}.${trackExt}`);
}

window.addEventListener("load", function () {
    const loader = document.querySelector(".loader");
    loader.className += " hidden"; // class "loader hidden"
});