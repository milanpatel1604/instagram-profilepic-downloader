// users functions:

async function displayUsers() {
    const usersData = await fetch('/getAllUsers').then((res) => res.json())
    if (usersData.status === 200) {
        const unauthorizedWarning = document.getElementById('unauthorizedWarning');
        unauthorizedWarning.style.display = 'none';
        if (usersData.results == null) {
            usersArr = [];
        }
        else {
            usersArr = usersData.data.users;
        }
        let usersTable = document.getElementById("usersTable");
        let html = "";
        var pCount=0;
        console.log(usersArr);
        await usersArr.forEach(function (element, index) {
            html += `<tr class='usersCol tableRows'>
                        <th scope="row">${element._id}</th>
                        <td>${element.name}</td>
                        <td>${element.email}</td>
                        <td>${element.role}</td>
                        <td>
                            <button type="button" class="btn btn-danger" onclick="banOrUnbanUser('${element._id}', '${element.user_banned}');">
                                ${ element.user_banned? "Unban" : "Ban" }
                            </button>
                        </td>
                    </tr>`;
            
            if(element.role === "premium" || element.role === "admin"){
                pCount += 1;
            }
        });
        if (usersArr.length != 0) {
            usersTable.innerHTML = html;
        }
        if (usersArr.length == 0) {
            const empty = document.getElementById('empty');
            empty.style.display = 'block';
        }

        const usersCount = document.getElementById('usersCount');
        usersCount.innerText = `Total Users: ${usersData.results}, Premium Users: ${pCount}, Normal Users: ${usersData.results - pCount}`
    }
    let search = document.getElementById("usersSearch");
    search.addEventListener("input", function () {
        let searchValue = search.value;
        let results = document.getElementsByClassName("tableRows");
        Array.from(results).forEach(function (element) {
            let cardTxt = element.getElementsByTagName("th")[0].innerText;
            cardTxt += element.getElementsByTagName("td")[0].innerText;
            cardTxt += element.getElementsByTagName("td")[1].innerText;
            cardTxt += element.getElementsByTagName("td")[2].innerText;
            cardTxt += element.getElementsByTagName("td")[3].innerText;
            if (cardTxt.toLowerCase().includes(searchValue.toLowerCase())) {
                element.style.display = "";
            }
            else {
                element.style.display = "none";
            }
        });
    });
}
displayUsers();

async function banOrUnbanUser(user_id, ban) {
    var result;
    if(ban=="false"){
        console.log("got request to ban")
        result=await fetch(`/banOrUnbanUser/${user_id}`, {
            method:"POST",
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({
                user_banned: true
            })
        })
    }
    else{
        console.log("got request to Unban")
        result=await fetch(`/banOrUnbanUser/${user_id}`, {
            method:"POST",
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({
                user_banned: false
            })
        })
    }
    console.log(result);
    if(result.status === 200){
        document.location.href='/users';
    }
    else if (result.status === 400){
        alert("Something went wrong! please try again");
    }
}

window.addEventListener("load", function () {
    const loader = document.querySelector(".loader");
    loader.className += " hidden"; // class "loader hidden"
});