// notification functions:

async function displayNotifications(){
    const notificationsData= await fetch('/getNotifications').then((res) => res.json())
    if(notificationsData.status === 200){
        const unauthorizedWarning=document.getElementById('unauthorizedWarning');
        unauthorizedWarning.style.display='none';
        if (notificationsData.results == null) {
            notificationsArr = [];
        }
        else {
            notificationsArr = notificationsData.data.notifications;
        }
        let notificationsTable = document.getElementById("notificationsTable");
        let html = "";
        await notificationsArr.forEach(function(element, index){
            html += `<tr class="tableRows">
                        <th scope="row">${element._id}</th>
                        <td>${element.message}</td>
                        <td>${element.date}</td>
                        <td>${element.isPremium? "to premium" : "to normal"}</td>
                        <td><button class="btn btn-danger">Delete</button></td>
                        <td><button class="btn btn-light">Update</button></td>
                    </tr>`;
           
        });
        if (notificationsArr.length != 0) {
            notificationsTable.innerHTML = html;
        }
        if (notificationsArr.length == 0) {
            const empty=document.getElementById('empty');
            empty.style.display='block';
        }
        const tracksCount=document.getElementById('tracksCount');
        tracksCount.innerText=`No.of results: ${notificationsData.results}`
        let search = document.getElementById("notificationsSearch");
        search.addEventListener("input", function () {
            let searchValue = search.value;
            let results = document.getElementsByClassName("tableRows");
            Array.from(results).forEach(function (element) {
                let cardTxt = element.getElementsByTagName("th")[0].innerText;
                cardTxt += element.getElementsByTagName("td")[0].innerText;
                cardTxt += element.getElementsByTagName("td")[1].innerText;
                cardTxt += element.getElementsByTagName("td")[2].innerText;
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
displayNotifications();


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