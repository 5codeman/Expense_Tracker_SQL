const dateInput = document.getElementById("date");
const dateShowBtn = document.getElementById("dateShowBtn");
const tbodyDaily = document.getElementById("tbodyDailyId");
const tfootDaily = document.getElementById("tfootDailyId");

const monthInput = document.getElementById("month");
const monthShowBtn = document.getElementById("monthShowBtn");
const tbodyMonthly = document.getElementById("tbodyMonthlyId");
const tfootMonthly = document.getElementById("tfootMonthlyId");

const logoutBtn = document.getElementById("logoutBtn");

dateShowBtn.addEventListener("click", getDailyReport);

async function getDailyReport(e) {
    try {
        e.preventDefault();
        const date = new Date(dateInput.value);
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
            date.getMonth() + 1
        )
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;

        let totalAmount = 0;
        const res = await axios.post(
            "http://localhost:9000/user/dailyReports",
            {
                date: formattedDate,
            }
            // ,{ headers: { Authorization: token } }
        );

        tbodyDaily.innerHTML = "";
        tfootDaily.innerHTML = "";

        res.data.forEach((expense) => {
            totalAmount += expense.amount;

            const tr = document.createElement("tr");
            tr.setAttribute("class", "trStyle");
            tbodyDaily.appendChild(tr);

            const th = document.createElement("th");
            th.setAttribute("scope", "row");
            th.appendChild(document.createTextNode(expense.date));

            const td1 = document.createElement("td");
            td1.appendChild(document.createTextNode(expense.category));

            const td2 = document.createElement("td");
            td2.appendChild(document.createTextNode(expense.description));

            const td3 = document.createElement("td");
            td3.appendChild(document.createTextNode(expense.amount));

            tr.appendChild(th);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
        });

        const tr = document.createElement("tr");
        tr.setAttribute("class", "trStyle");
        tfootDaily.appendChild(tr);

        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        const td4 = document.createElement("td");

        td3.setAttribute("id", "dailyTotal");
        td4.setAttribute("id", "dailyTotalAmount");
        td3.appendChild(document.createTextNode("Total"));
        td4.appendChild(document.createTextNode(totalAmount));

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
    } catch (error) {
        console.log(error);
    }
}

monthShowBtn.addEventListener("click", getMonthlyReport);

async function getMonthlyReport(e) {
    try {
        e.preventDefault();
        // const token = localStorage.getItem("token");
        const month = new Date(monthInput.value);
        const formattedMonth = `${(month.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;

        let totalAmount = 0;
        const res = await axios.post(
            "http://localhost:9000/user/monthlyReports",
            {
                month: formattedMonth,
            }
            // ,{ headers: { Authorization: token } }
        );

        tbodyMonthly.innerHTML = "";
        tfootMonthly.innerHTML = "";

        res.data.forEach((expense) => {
            totalAmount += expense.amount;

            const tr = document.createElement("tr");
            tr.setAttribute("class", "trStyle");
            tbodyMonthly.appendChild(tr);

            const th = document.createElement("th");
            th.setAttribute("scope", "row");
            th.appendChild(document.createTextNode(expense.date));

            const td1 = document.createElement("td");
            td1.appendChild(document.createTextNode(expense.category));

            const td2 = document.createElement("td");
            td2.appendChild(document.createTextNode(expense.description));

            const td3 = document.createElement("td");
            td3.appendChild(document.createTextNode(expense.amount));

            tr.appendChild(th);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
        });

        const tr = document.createElement("tr");
        tr.setAttribute("class", "trStyle");
        tfootMonthly.appendChild(tr);

        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        const td4 = document.createElement("td");

        td3.setAttribute("id", "monthlyTotal");
        td4.setAttribute("id", "monthlyTotalAmount");
        td3.appendChild(document.createTextNode("Total"));
        td4.appendChild(document.createTextNode(totalAmount));

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
    } catch (error) {
        console.log(error);
    }
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
