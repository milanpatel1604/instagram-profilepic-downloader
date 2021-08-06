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
            html += `<tr>
                        <th scope="row">${element._id}</th>
                        <td>${element.title}</td>
                        <td>${element.artist}</td>
                        <td>${element.description}</td>
                        <td>${element.date}</td>
                        <td>${element.startTime} - ${element.endTime}</td>
                        <td><button class="btn btn-danger">Delete</button></td>
                        <td><button class="btn btn-light">Update</button></td>
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
    }
}
displayLiveTracks();


async function doesHttpOnlyCookieExist(){
    const check= await fetch('/check').then((res) => res.json())
    const loginBtn=document.getElementById('loginBtn');
    const logoutBtn=document.getElementById('logoutBtn');
    if(check.status===200){
        loginBtn.style.display='none';
        logoutBtn.style.display='block';
    }
    else{
        logoutBtn.style.display='none';
        loginBtn.style.display='block';
    }
}
// setInterval(() => {
//     doesHttpOnlyCookieExist();
// }, 1000);

const logoutBtn=document.getElementById('logoutBtn');
logoutBtn.addEventListener('click',async ()=>{
    let logout= await fetch('/logout').then((res) => res.json())
    if(logout.status===200){
        doesHttpOnlyCookieExist();
    }
})