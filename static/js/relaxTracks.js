// tracks functions:

async function displayRelaxTracks(){
    const relaxTracksData= await fetch('/getRelaxTracks').then((res) => res.json())
    if(relaxTracksData.status === 200){
        const unauthorizedWarning=document.getElementById('unauthorizedWarning');
        unauthorizedWarning.style.display='none';
        if (relaxTracksData.results == null) {
            relaxTracksArr = [];
        }
        else {
            relaxTracksArr = relaxTracksData.data.tracks;
        }
        let relaxTracksTable = document.getElementById("relaxTracksTable");
        let html = "";
        await relaxTracksArr.forEach(function(element, index){
            html += `<tr class="tableRows">
                        <th id="itemID" scope="row">${element._id}</th>
                        <td>${element.title}</td>
                        <td>${element.category}</td>
                        <td>${element.artist}</td>
                        <td>${element.description}</td>
                        <td>${element.isPremium? "premium" : "normal"}</td>
                        <td><button class="btn btn-danger" onclick="deleteTrack('${element._id}');">Delete</button></td>
                        <td><button class="btn btn-light" onclick="updateTrack(${element._id})">Update</button></td>
                    </tr>`;
           
        });
        if (relaxTracksArr.length != 0) {
            relaxTracksTable.innerHTML = html;
        }
        if (relaxTracksArr.length == 0) {
            const empty=document.getElementById('empty');
            empty.style.display='block';
        }
        const tracksCount=document.getElementById('tracksCount');
        tracksCount.innerText=`No.of results: ${relaxTracksData.results}`
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
displayRelaxTracks();