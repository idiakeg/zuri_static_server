let inputField = document.querySelectorAll("#textInput");
let email = document.getElementById("emailInput");
let form = document.getElementById("form");
let phone = document.getElementById("phone_number");

inputField.forEach((item) => {
    item.addEventListener("input", function (event) {
        let inputValue = event.target.value;

        // Remove any numbers from the input value
        let textOnlyValue = inputValue.replace(/[0-9]/g, "");

        // Update the input field value with the text-only value
        event.target.value = textOnlyValue;
    });
});

let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!emailRegex.test(email.value)) {
        alert("Please enter a valid email address.");
    }

    if (phone.value.length !== 11) {
        alert("Phone number should be exactly 11 numbers");
        return;
    }

    let fd = new FormData(form);
    // convert form data to javascript objects
    let data = Object.fromEntries(fd);

    fetch("http://localhost:4343/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));

    // window.location = "/success.html";
});
