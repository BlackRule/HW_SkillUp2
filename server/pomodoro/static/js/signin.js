//Typedefs
/**
 * @typedef {Object} SignInResponse
 * @property {string} auth_token
 */
"use strict";

function sendData(form) {
    const data = new URLSearchParams();
    for (const pair of new FormData(form)) {
        data.append(pair[0], pair[1]);
    }
    localStorage.setItem("username", data.get("username"))
    fetch('/auth/token/login/', {
        method: 'post',
        body: data,
    })
        .then((response) => {
            if (!response.ok) {
                console.log(response)
                response.json().then(
                    (d) => {
                        console.log(d)
                    });
            } else {
                response.json().then(
                    /** @param d {SignInResponse}*/
                    (d) => {
                        localStorage.setItem("auth_token", d.auth_token)
                        location.replace("/")
                    });
            }
        })
        .catch((err) => {
            console.log("ERROR: ");
            console.log(err)

        });
}

window.addEventListener("load", function () {
    const form = document.getElementById("form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        sendData(e.target);
    });
});