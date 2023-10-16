const resetPasswordBtn = document.getElementById("resetPasswordBtn");

resetPasswordBtn.addEventListener("click", updatePassword);

async function updatePassword() {
    try {
        const newPassword = document.getElementById("newPassword").value;
        const res = await axios.post(
            "http://43.204.140.151:9000/resetPassword", { password: newPassword }
        );
        alert(res.data.message);
        window.location.href = "/";
    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
        window.location.reload();
    }
}

