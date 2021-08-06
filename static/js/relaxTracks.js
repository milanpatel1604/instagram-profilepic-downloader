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
        if (relaxTracksArr.length != 0) {
            relaxTracksTable.innerHTML = html;
        }
        if (relaxTracksArr.length == 0) {
            const empty=document.getElementById('empty');
            empty.style.display='block';
        }
        const tracksCount=document.getElementById('tracksCount');
        tracksCount.innerText=`No.of results: ${relaxTracksData.results}`
    }
}
displayRelaxTracks();


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