// tracks functions:

async function displayLiveTracks(){
    const liveTracksData= await fetch('/getLiveTracks').then((res) => res.json())
    if(liveTracksData.status === 200){
        const unauthorizedWarning=document.getElementById('unauthorizedWarning');
        unauthorizedWarning.style.display='none';
        if (liveTracksData.results == null) {
            liveTracksArr = [];
        }
        else {
            liveTracksArr = liveTracksData.data.tracks;
        }
        let liveTracksTable = document.getElementById("liveTracksTable");
        let html = "";
        await liveTracksArr.forEach(function(element, index){
            html += `<tr class="tableRows">
                        <th id="itemID" scope="row">${element._id}</th>
                        <td>${element.title}</td>
                        <td>${element.artist}</td>
                        <td>${element.description}</td>
                        <td>${element.date}</td>
                        <td>${element.startTime} - ${element.endTime}</td>
                        <td><button class="btn btn-danger" onclick="deleteTrack('${element._id}');">Delete</button></td>
                        <td>
                            <button type="button" class="btn btn-success" onclick="playTrack('${element._id}', '${element.title}', '${element.image_extention}', '${element.track_extention}');" data-bs-toggle="modal" data-bs-target="#playModal">
                                Play
                            </button>
                        </td>
                    </tr>`;
           
        });
        if (liveTracksArr.length != 0) {
            liveTracksTable.innerHTML = html;
        }
        if (liveTracksArr.length == 0) {
            const empty=document.getElementById('empty');
            empty.style.display='block';
        }
        const tracksCount=document.getElementById('tracksCount');
        tracksCount.innerText=`No.of results: ${liveTracksData.results}`
        let search = document.getElementById("liveTracksSearch");
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
displayLiveTracks();


// CRUD functions
async function deleteTrack(id){
    console.log(id);
    const result=await fetch(`/liveTrackDelete/${id}`, {
        method:"DELETE"
    })
    if(result.status === 200){
        console.log('deleted');
        document.location.href='/liveMeditation';
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
    trackImage.setAttribute('src', `http://127.0.0.1:3000/static/tracks/liveImages/${id}.${imgExt}`);
    audioPlayer.setAttribute('src', `http://127.0.0.1:3000/static/tracks/liveTracks/${id}.${trackExt}`);
}

window.addEventListener("load", function () {
    const loader = document.querySelector(".loader");
    loader.className += " hidden"; // class "loader hidden"
});