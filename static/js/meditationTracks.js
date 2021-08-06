// tracks functions:

async function displayMeditationTracks() {
    const meditationTracksData = await fetch('/getMeditationTracks').then((res) => res.json())
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
            html += `<tr>
                        <th scope="row">${element._id}</th>
                        <td>${element.title}</td>
                        <td>${element.category}</td>
                        <td>${element.artist}</td>
                        <td>${element.description}</td>
                        <td>${element.isPremium ? "premium" : "normal"}</td>
                        <td><button class="btn btn-danger">Delete</button></td>
                        <td><button class="btn btn-light">Update</button></td>
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
}
displayMeditationTracks();

async function doesHttpOnlyCookieExist() {
    const check = await fetch('/check').then((res) => res.json())
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    if (check.status === 200) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    }
    else {
        logoutBtn.style.display = 'none';
        loginBtn.style.display = 'block';
    }
}
// setInterval(() => {
//     doesHttpOnlyCookieExist();
// }, 1000);

const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', async () => {
    let logout = await fetch('/logout').then((res) => res.json())
    if (logout.status === 200) {
        doesHttpOnlyCookieExist();
    }
})




// let search = document.getElementById("usersSearch");
//         search.addEventListener("input", function () {
//             let searchValue = search.value;
//             console.log(searchValue);
//             let results = document.getElementsByClassName("usersCol");
//             Array.from(results).forEach(function (element) {
//                 let cardTxt = element.getElementsByTagName("th")[0].innerText;
//                 cardTxt += element.getElementsByTagName("td")[0].innerText;
//                 cardTxt += element.getElementsByTagName("td")[1].innerText;
//                 cardTxt += element.getElementsByTagName("td")[2].innerText;
//                 if (cardTxt.toLowerCase().includes(searchValue.toLowerCase())) {
//                     element.style.display = "block";
//                 }
//                 else {
//                     element.style.display = "none";
//                 }
//             });
//         });