const resetPasswordLinkBtn = document.getElementById("resetPasswordLinkBtn");

resetPasswordLinkBtn.addEventListener("click", sendMail);

async function sendMail() {
    try {
        const email = document.getElementById("email").value;
        const res = await axios.post("http://43.204.140.151:9000/sendMail", {
            email: email,
        });
        alert(res.data.message);
        window.location.href = "/";
    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
        window.location.reload();
    }
}
