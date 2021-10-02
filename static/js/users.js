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
        await usersArr.forEach(function (element, index) {
            html += `<tr class='usersCol'>
                        <th scope="row">${element._id}</th>
                        <td>${element.name}</td>
                        <td>${element.email}</td>
                        <td>${element.role}</td>
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
}
displayUsers();

window.addEventListener("load", function () {
    const loader = document.querySelector(".loader");
    loader.className += " hidden"; // class "loader hidden"
});