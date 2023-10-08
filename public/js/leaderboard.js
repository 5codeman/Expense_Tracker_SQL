const tbody = document.getElementById("tbodyId");
const logoutBtn = document.getElementById("logoutBtn");

document.addEventListener("DOMContentLoaded", getLeaderboard);

async function getLeaderboard() {
    const res = await axios.get("http://localhost:9000/user/getLeaderboardUser");
    res.data.sort((a, b) => {
        return b.totalExpenses - a.totalExpenses; //sort in desending order
    })
    let position = 1;
    res.data.forEach((user) => {
        let name = user.name;
        let amount = user.totalExpenses;

        let tr = document.createElement("tr");
        tr.setAttribute("class", "trStyle");
        tbody.appendChild(tr);

        let th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.appendChild(document.createTextNode(position));

        let td1 = document.createElement("td");
        td1.appendChild(document.createTextNode(name));

        let td2 = document.createElement("td");
        td2.appendChild(document.createTextNode(amount));

        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td2);

        position++;
    });
}

logoutBtn.addEventListener("click", logout);

async function logout() {
    try {
        // Expire/delete the browser cookies
        // For delete or expire this cookies we have to write the path here. because the path of cookies is '/' because at the set cookies time it is set from the '/' route. cookies path is taken by the rout or starting rout of the url.
        // this cookies path is the location in the sever where the cookies are stored
        document.cookie = "jwt_token=; max-age=-60; path=/"; // ? Any diff. way to do this and why we write like this ??
        window.location.href = "/";
    } catch (err) {
        console.log(err);
    }
}