//Typedefs
/**
 * @typedef {Object} SignUpResponse
 * @property {string} email
 * @property {string} username
 * @property {number} id
 */
"use strict";

function sendData(form) {
    const data = new URLSearchParams();
    for (const pair of new FormData(form)) {
        data.append(pair[0], pair[1]);
    }
    fetch('/auth/users/', {
        method: 'post',
        body: data,
    })
        .then((response) => {
            if (!response.ok) {
                console.log(response)
                response.json().then(
                    (data) => {
                        console.log(data)
                        for(const f of ["password","username","email"])
                        if(data[f]){
                            for(const e of data[f])
                            $_(`${f}errors`).innerHTML+=`<span>${e}</span>`
                        }
                    });
            } else {
                response.json().then(
                    /** @param data {SignUpResponse}*/
                    (data) => {
                        location.replace("/signin")
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
        return false
    });
});