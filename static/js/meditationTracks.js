const url='http://127.0.0.1:3000';
const meditationBeginnersId='6144992adfc3482e180580d8';
const meditationStressId='61449968dfc3482e180580d9';

// tracks functions:
async function displayMeditationTracks() {
    const meditationTracksData = await fetch('/getMeditationTracks').then((res) => res.json())
    console.log(meditationTracksData)
    if (meditationTracksData.status === 200) {
        const unauthorizedWarning = document.getElementById('unauthorizedWarning');
        unauthorizedWarning.style.display = 'none';
        if (meditationTracksData.results == null) {
            meditationTracksArr = [];
        }
        else {
            meditationTracksArr = meditationTracksData.data.tracks;
        }
        let meditationTracksTable = document.getElementById("meditationTracksTable");
        let html = "";
        await meditationTracksArr.forEach(function (element, index) {
            var category=[];
            if(element.category_id.includes(meditationBeginnersId)){
                category.push("Beginners")
            }
            if(element.category_id.includes(meditationStressId)){
                category.push("Stress")
            }
            html += `<tr class="tableRows">
                        <th scope="row">${element._id}</th>
                        <td>${element.title}</td>
                        <td>${category}</td>
                        <td>${element.artist}</td>
                        <td>${element.description}</td>
                        <td>${element.isPremium ? "premium" : "normal"}</td>
                        <td><button class="btn btn-danger" onclick="deleteTrack('${element._id}');">Delete</button></td>
                        <td>
                            <button type="button" class="btn btn-success" onclick="playTrack('${element._id}', '${element.title}', '${element.image_extention}', '${element.track_extention}');" data-bs-toggle="modal" data-bs-target="#playModal">
                                Play
                            </button>
                        </td>
                    </tr>`;
        });
        if (meditationTracksArr.length != 0) {
            meditationTracksTable.innerHTML = html;
        }
        if (meditationTracksArr.length == 0) {
            const empty = document.getElementById('empty');
            empty.style.display = 'block';
        }
        const tracksCount = document.getElementById('tracksCount');
        tracksCount.innerText = `No.of results: ${meditationTracksData.results}`
    }
    let search = document.getElementById("meditationTracksSearch");
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
displayMeditationTracks();


// CRUD functions
async function deleteTrack(id){
    console.log(id);
    const result=await fetch(`/meditationTrackDelete/${id}`, {
        method:"DELETE"
    })
    if(result.status === 200){
        console.log('deleted');
        document.location.href='/meditationTracks';
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
    trackImage.setAttribute('src', `/static/tracks/meditationImages/${id}.${imgExt}`);
    audioPlayer.setAttribute('src', `/static/tracks/meditationTracks/${id}.${trackExt}`);
}

window.addEventListener("load", function () {
    const loader = document.querySelector(".loader");
    loader.className += " hidden"; // class "loader hidden"
});