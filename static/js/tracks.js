const url='http://127.0.0.1:3000';

//change category according to section
async function populate(sectionSelectId, categorySelectId) {
    const sectionSelectElement=document.getElementById(sectionSelectId);
    const categorySelectElement=document.getElementById(categorySelectId);
    const section=await sectionSelectElement.value;
    const getSectionCategories = await fetch(`/getSectionCategories/${section}`).then((res) => res.json())
    categorySelectElement.innerHTML="";
    const category_arr=await getSectionCategories.data;
    for(var option in category_arr){
        var newOption= document.createElement("option")
        newOption.value=category_arr[option];
        newOption.innerHTML=category_arr[option];
        await categorySelectElement.options.add(newOption);
    }
}

// tracks functions:
async function displayMeditationTracks() {
    const tracksData = await fetch('/getAllTracks').then((res) => res.json())
    console.log(tracksData)
    if (tracksData.status === 200) {
        const unauthorizedWarning = document.getElementById('unauthorizedWarning');
        unauthorizedWarning.style.display = 'none';
        if (tracksData.results == null) {
            tracksArr = [];
        }
        else {
            tracksArr = tracksData.data.data;
        }
        let tracksTable = document.getElementById("tracksTable");
        let html = "";
        await tracksArr.forEach(function (element, index) {
            html += `<tr class="tableRows">
                        <th scope="row">${element.track_id}</th>
                        <td>${element.section}</td>
                        <td>${element.category}</td>
                        <td>${element.title}</td>
                        <td>${element.artist}</td>
                        <td>${element.description}</td>
                        <td>${element.isPremium ? "premium" : "normal"}</td>
                        <td><button class="btn btn-danger" onclick="deleteTrack('${element.track_id}');">Delete</button></td>
                        <td>
                            <button type="button" class="btn btn-success" onclick="playTrack('${element.track_id}', '${element.title}', '${element.image_extention}', '${element.track_extention}');" data-bs-toggle="modal" data-bs-target="#playModal">
                                Play
                            </button>
                        </td>
                    </tr>`;
        });
        if (tracksArr.length != 0) {
            tracksTable.innerHTML = html;
        }
        if (tracksArr.length == 0) {
            const empty = document.getElementById('empty');
            empty.style.display = 'block';
        }
        const tracksCount = document.getElementById('tracksCount');
        tracksCount.innerText = `No.of results: ${tracksData.results}`
    }
    let search = document.getElementById("tracksSearch");
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
            cardTxt += element.getElementsByTagName("td")[5].innerText;
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
    const result=await fetch(`/trackDelete/${id}`, {
        method:"DELETE"
    })
    if(result.status === 200){
        console.log('deleted');
        document.location.href='/tracks';
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
    trackImage.setAttribute('src', `/static/tracks/musicImages/${id}.${imgExt}`);
    audioPlayer.setAttribute('src', `/static/tracks/musicTracks/${id}.${trackExt}`);
}

window.addEventListener("load", function () {
    const loader = document.querySelector(".loader");
    loader.className += " hidden"; // class "loader hidden"
});

