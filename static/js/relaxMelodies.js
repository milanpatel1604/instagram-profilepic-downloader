
// tracks functions:
async function displayRelaxMelodies(){
    const relaxMelodySoundsData= await fetch('/getRelaxMelodySounds').then((resp) => resp.json())
    if(relaxMelodySoundsData.status === 200){
        const unauthorizedWarning=document.getElementById('unauthorizedWarning');
        unauthorizedWarning.style.display='none';
        if (relaxMelodySoundsData.results == null) {
            relaxMelodiesArr = [];
        }
        else {
            relaxMelodiesArr =await relaxMelodySoundsData.data.tracks;
        }
        console.log(relaxMelodySoundsData.data.tracks);
        let relaxMelodiesTable = document.getElementById("relaxMelodiesTable");
        let html = "";
        await relaxMelodiesArr.forEach(function(element, index){
            html += `<tr class="tableRows">
                        <th id="itemID" scope="row">${element._id}</th>
                        <td>${element.sound_title}</td>
                        <td>${element.sound_category}</td>
                        <td><button class="btn btn-danger" onclick="deleteSound('${element._id}');">Delete</button></td>
                        <td>
                        <audio controls id="audioPlayer" src="http://127.0.0.1:3000/static/tracks/relaxMelodySounds/${element._id}.${element.track_extention}" type="audio/mpeg"></audio>
                        </td>
                    </tr>`;
        });
        if (relaxMelodiesArr.length != 0) {
            relaxMelodiesTable.innerHTML = html;
        }
        if (relaxMelodiesArr.length == 0) {
            const empty=document.getElementById('empty');
            empty.style.display='block';
        }
        const tracksCount=document.getElementById('tracksCount');
        tracksCount.innerText=`No.of results: ${relaxMelodySoundsData.results}`
        let search = document.getElementById("relaxMelodiesSearch");
        search.addEventListener("input", function () {
            let searchValue = search.value;
            let results = document.getElementsByClassName("tableRows");
            Array.from(results).forEach(function (element) {
                let cardTxt = element.getElementsByTagName("th")[0].innerText;
                cardTxt += element.getElementsByTagName("td")[0].innerText;
                cardTxt += element.getElementsByTagName("td")[1].innerText;
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
displayRelaxMelodies();

//CRUD
async function deleteSound(id){
    console.log(id);
    const result=await fetch(`/relaxMelodySoundDelete/${id}`, {
        method:"DELETE"
    })
    if(result.status === 200){
        document.location.href='/relaxMelodies';
    }
    else if (result.status === 400){
        console.log("Something went wrong! please try again");
    }
}

window.addEventListener("load", function () {
    const loader = document.querySelector(".loader");
    loader.className += " hidden"; // class "loader hidden"
});