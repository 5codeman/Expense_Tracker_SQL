const categoryItems = document.querySelectorAll(".dropdown-item");
const categoryInput = document.querySelector("#categoryInput");
const categoryBtn = document.querySelector("#categoryBtn");
const form = document.getElementById("form1");
const addExpenseBtn = document.getElementById("submitBtn");
const table = document.getElementById("tbodyId");
const buyPremiumBtn = document.getElementById("buyPremiumBtn");
const reportsLink = document.getElementById("reportsLink");
const leaderboardLink = document.getElementById("leaderboardLink");
const logoutBtn = document.getElementById("logoutBtn");

// Select category and show in select categroy dropdow button in dashboard
categoryItems.forEach((item) => {
    item.addEventListener("click", (e) => {
        const selectedCategory = e.target.getAttribute("data-value");
        categoryBtn.textContent = e.target.textContent;
        categoryInput.value = selectedCategory;
    });
});

addExpenseBtn.addEventListener("click", addExpense);

async function addExpense() {
    try {
        const category = document.getElementById("categoryBtn");
        const description = document.getElementById("descriptionValue");
        const amount = document.getElementById("amountValue");
        const categoryValue = category.textContent.trim();
        const descriptionValue = description.value.trim();
        const amountValue = parseInt(amount.value);

        if (categoryValue == "Select Category" || !descriptionValue || !amountValue) {
            alert('Please fill all the fields');
            window.location.href = '/user_dashboard';
        }

        const currentDate = new Date();
        const day = currentDate.getDate(); // date
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();


        // add leading zeros to day and month if needed
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;

        // create the date string in date-month-year format
        const dateStr = `${formattedDay}-${formattedMonth}-${year}`;

        // console.log(dateStr); // outputs something like "23-02-2023"

        // const token = localStorage.getItem("token");

        //here we paas json object and this is api call from frontend to backend
        await axios.post('http://localhost:9000/expense/addExpense', {
            date: dateStr,
            category: categoryValue,
            description: descriptionValue,
            amount: amountValue
        }
            // ,{ headers: { Authorization: token } }
        ).then((res) => {
            if (res.status == 200) {
                window.location.reload(); // Pending -: doubt why use this, try to do diff.way..
            }
        }).catch((err) => {
            console.log(err);
        });

    } catch {
        (err) => console.log(err);
    }
}

// when page is load or reload
document.addEventListener("DOMContentLoaded", getAllExpenses);

async function getAllExpenses() {
    // e.preventDefault();
    try {
        // const token = localStorage.getItem("token");
        const res = await axios.get(
            "http://localhost:9000/expense/getAllExpenses" // /1 ,
            // { headers: { Authorization: token } }
        );

        res.data.forEach((expenses) => { //.expenses
            const id = expenses.id;
            const date = expenses.date;
            const categoryValue = expenses.category;
            const descriptionValue = expenses.description;
            const amountValue = expenses.amount;

            let tr = document.createElement("tr");
            tr.className = "trStyle";
            table.appendChild(tr);

            let idValue = document.createElement("th");
            idValue.setAttribute("scope", "row");
            idValue.setAttribute("style", "display: none"); //hidden
            idValue.appendChild(document.createTextNode(id));
            tr.appendChild(idValue);

            let th = document.createElement("th");
            th.setAttribute("scope", "row");
            th.appendChild(document.createTextNode(date));
            tr.appendChild(th);

            let td1 = document.createElement("td");
            td1.appendChild(document.createTextNode(categoryValue));

            let td2 = document.createElement("td");
            td2.appendChild(document.createTextNode(descriptionValue));

            let td3 = document.createElement("td");
            td3.appendChild(document.createTextNode(amountValue));

            let td4 = document.createElement("td");

            let deleteBtn = document.createElement("button");
            deleteBtn.className = "editDelete btn btn-danger delete";
            deleteBtn.appendChild(document.createTextNode("Delete"));

            let editBtn = document.createElement("button");
            editBtn.className = "editDelete btn btn-success edit";
            editBtn.appendChild(document.createTextNode("Edit"));

            td4.appendChild(deleteBtn);
            td4.appendChild(editBtn);

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
        });

        // ---------------------------------------------------------------------//

        // const ul = document.getElementById("paginationUL");
        // for (let i = 1; i <= res.data.totalPages; i++) {
        //     const li = document.createElement("li");
        //     const a = document.createElement("a");
        //     li.setAttribute("class", "page-item");
        //     a.setAttribute("class", "page-link");
        //     a.setAttribute("href", "#");
        //     a.appendChild(document.createTextNode(i));
        //     li.appendChild(a);
        //     ul.appendChild(li);
        //     a.addEventListener("click", paginationBtn);
        // }
    } catch {
        (err) => console.log(err);
    }
}

// async function paginationBtn(e) {
//     try {
//         const pageNo = e.target.textContent;
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//             `http://localhost:3000/expense/getAllExpenses/${pageNo}`,
//             { headers: { Authorization: token } }
//         );

//         table.innerHTML = "";

//         res.data.expenses.forEach((expenses) => {
//             const id = expenses.id;
//             const date = expenses.date;
//             const categoryValue = expenses.category;
//             const descriptionValue = expenses.description;
//             const amountValue = expenses.amount;

//             let tr = document.createElement("tr");
//             tr.className = "trStyle";

//             table.appendChild(tr);

//             let idValue = document.createElement("th");
//             idValue.setAttribute("scope", "row");
//             idValue.setAttribute("style", "display: none");

//             let th = document.createElement("th");
//             th.setAttribute("scope", "row");

//             tr.appendChild(idValue);
//             tr.appendChild(th);

//             idValue.appendChild(document.createTextNode(id));
//             th.appendChild(document.createTextNode(date));

//             let td1 = document.createElement("td");
//             td1.appendChild(document.createTextNode(categoryValue));

//             let td2 = document.createElement("td");
//             td2.appendChild(document.createTextNode(descriptionValue));

//             let td3 = document.createElement("td");
//             td3.appendChild(document.createTextNode(amountValue));

//             let td4 = document.createElement("td");

//             let deleteBtn = document.createElement("button");
//             deleteBtn.className = "editDelete btn btn-danger delete";
//             deleteBtn.appendChild(document.createTextNode("Delete"));

//             let editBtn = document.createElement("button");
//             editBtn.className = "editDelete btn btn-success edit";
//             editBtn.appendChild(document.createTextNode("Edit"));

//             td4.appendChild(deleteBtn);
//             td4.appendChild(editBtn);

//             tr.appendChild(td1);
//             tr.appendChild(td2);
//             tr.appendChild(td3);
//             tr.appendChild(td4);
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }

table.addEventListener("click", (e) => {
    deleteExpense(e);
});

async function deleteExpense(e) {
    try {
        // const token = localStorage.getItem("token");
        if (e.target.classList.contains("delete")) {
            let tr = e.target.parentElement.parentElement; //table row
            let id = tr.children[0].textContent;
            const res = await axios.get(
                `http://localhost:9000/expense/deleteExpense/${id}`
                // ,{ headers: { Authorization: token } }
            ).then(() => {
                window.location.reload();
            }).catch((err) => {
                console.log(err);
            });
        }
    } catch {
        (err) => console.log(err);
    }
}

table.addEventListener("click", (e) => {
    editExpense(e);
});

async function editExpense(e) {
    try {
        // const token = localStorage.getItem("token");
        const categoryValue = document.getElementById("categoryBtn");
        const descriptionValue = document.getElementById("descriptionValue");
        const amountValue = document.getElementById("amountValue");
        const addExpenseBtn = document.getElementById("submitBtn");

        if (e.target.classList.contains("edit")) {
            let tr = e.target.parentElement.parentElement;
            let id = tr.children[0].textContent;
            //Fill the input values with the existing values
            const res = await axios.get(
                "http://localhost:9000/expense/getAllExpenses" // here not need of api call we can acess all the data from tr.children[1] tr.children[2].... so on
                // ,{ headers: { Authorization: token } }
            );
            res.data.forEach((expense) => {
                if (expense.id == id) {
                    categoryValue.textContent = expense.category;
                    descriptionValue.value = expense.description;
                    amountValue.value = expense.amount;
                    addExpenseBtn.textContent = "Update";

                    // const form = document.getElementById("form1");
                    addExpenseBtn.removeEventListener("click", addExpense);

                    addExpenseBtn.addEventListener("click", async function update(e) {
                        e.preventDefault();
                        // console.log("request to backend for edit");
                        const res = await axios.post(
                            `http://localhost:9000/expense/updateExpense/${id}`,
                            {
                                category: categoryValue.textContent.trim(),
                                description: descriptionValue.value,
                                amount: amountValue.value,
                            }
                            //, { headers: { Authorization: token } }
                        );
                        window.location.reload();
                    });
                }
            });
        }
    } catch {
        (err) => console.log(err);
    }
}

logoutBtn.addEventListener("click", logout);

async function logout() {
    try {
        // Expire/delete the browser cookies
        // For delete or expire this cookies we have to write the path here. but for this user dashboard page writing path is optional because the path of page is / and path of cookies is also /. cookies path is taken by the rout or starting rout of the url
        document.cookie = "jwt_token=; max-age=-60"; // ? Any diff. way to do this and why we write like this ??
        window.location.href = "/";
    } catch (err) {
        console.log(err);
    }
}

buyPremiumBtn.addEventListener("click", buyPremium);

async function buyPremium(e) {
    // const token = localStorage.getItem("token");
    const res = await axios.get(
        "http://localhost:9000/user/premiumMembership"
        // ,{ headers: { Authorization: token } }
    );

    var options = {
        key: res.data.key_id, // Enter the Key ID generated from the Dashboard
        order_id: res.data.order.id, // For one time payment
        // This handler function will handle the success payment
        handler: async function (response) {
            const res = await axios.post(
                "http://localhost:9000/user/updateTransactionStatus",
                {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                }
                // ,{ headers: { Authorization: token } }
            );

            alert(
                "Welcome to our Premium Membership, You have now access to Reports and LeaderBoard"
            );
            window.location.reload();
            // localStorage.setItem("token", res.data.token);
        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    // e.preventDefault();
}

document.addEventListener("DOMContentLoaded", isPremiumUser);

async function isPremiumUser() {
    // const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:9000/user/isPremiumUser", {
        //   headers: { Authorization: token },
    });
    if (res.data.isPremiumUser) {
        buyPremiumBtn.innerHTML = "Premium Member &#128081";
        buyPremiumBtn.removeEventListener("click", buyPremium);
        leaderboardLink.removeAttribute("onclick");
        reportsLink.removeAttribute("onclick");
        leaderboardLink.setAttribute("href", "/user/getLeaderboardPage");
        reportsLink.setAttribute("href", "/user/getReportsPage");
    }
}

