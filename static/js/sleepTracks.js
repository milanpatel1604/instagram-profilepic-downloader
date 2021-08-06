// tracks functions:

async function displaySleepTracks(){
    const sleepTracksData= await fetch('/getSleepTracks').then((res) => res.json())
    if(sleepTracksData.status === 200){
        const unauthorizedWarning=document.getElementById('unauthorizedWarning');
        unauthorizedWarning.style.display='none';
        if (sleepTracksData.results == null) {
            sleepTracksArr = [];
        }
        else {
            sleepTracksArr = sleepTracksData.data.tracks;
        }
        let sleepTracksTable = document.getElementById("sleepTracksTable");
        let html = "";
        await sleepTracksArr.forEach(function(element, index){
            html += `<tr>
                        <th scope="row">${element._id}</th>
                        <td>${element.title}</td>
                        <td>${element.category}</td>
                        <td>${element.artist}</td>
                        <td>${element.description}</td>
                        <td>${element.isPremium? "premium" : "normal"}</td>
                        <td><button class="btn btn-danger">Delete</button></td>
                        <td><button class="btn btn-light">Update</button></td>
                    </tr>`;
           
        });
        if (sleepTracksArr.length != 0) {
            sleepTracksTable.innerHTML = html;
        }
        if (sleepTracksArr.length == 0) {
            const empty=document.getElementById('empty');
            empty.style.display='block';
        }
        const tracksCount=document.getElementById('tracksCount');
        tracksCount.innerText=`No.of results: ${sleepTracksData.results}`
    }
}
displaySleepTracks();


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