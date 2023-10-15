// control the show or hide of task n bottons
var showOrHide = 0;
function q3task0() {
    if (showOrHide === 0) {
        document.querySelector('#q3task0').innerText = 'Hide';
        // document.getElementById('q3buttons').style.visibility = "visible";
        document.getElementById('q3buttons').style.display = "";
    } else {
        document.querySelector('#q3task0').innerText = 'Show';
        // document.getElementById('q3buttons').style.visibility = "hidden";
        document.getElementById('q3buttons').style.display = "none";
    }
    showOrHide = !(showOrHide);
}

// control the align mode of columns
// left -> center -> right -> left -> ...
var alignMode = 0;
function q3task1() {
    switch (alignMode) {
        case (0):
            document.querySelectorAll('.columns').forEach(column => {
                column.style.textAlign = "center";
            });
            alignMode++;
            break;
        case (1):
            document.querySelectorAll('.columns').forEach(column => {
                column.style.textAlign = "right";
            });
            alignMode++;
            break;
        case (2):
            document.querySelectorAll('.columns').forEach(column => {
                column.style.textAlign = "left";
            });
            alignMode = 0;
            break;
    }
}

// using prompt()
function q3task2() {
    let userPrompt = prompt("Please enter a spotlight of the celebrity");
    if (userPrompt != null && userPrompt.length != 0) {
        const node = document.createElement("li");
        const textnode = document.createTextNode(userPrompt);
        node.appendChild(textnode);
        document.getElementById("spotlightList").appendChild(node);
    }
}

// control the show or hide of the progress bar
var showOrHide_t3 = 0;
function q3task3() {
    if (showOrHide_t3 === 0) {
        document.getElementById('q3task3pb').style.display = "";
    } else {
        document.getElementById('q3task3pb').style.display = "none";
    }
    showOrHide_t3 = !(showOrHide_t3);
}

// control the % progress of the progress bar
window.addEventListener('scroll', function () {
    const scrollHeight = document.body.clientHeight - window.innerHeight;
    const scrollPercentage = (window.scrollY / scrollHeight) * 100;
    document.querySelector('.progress-bar').style.width = scrollPercentage + '%';
})

// submit form (form validation and fetch)
function submitForm(e) {
    e.preventDefault();

    const email = document.querySelector('#email');
    const comment = document.querySelector('#comment');
    let color = document.querySelector('.radioButtons').querySelector('input[name="color"]:checked');

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    const isValidEmail = emailRegex.test(email.value);

    const isEmptyEmail = email.value.trim() === '';
    const isEmptyComment = comment.value.trim() === '';

    if (!isValidEmail || isEmptyComment || isEmptyEmail) {
        if (isEmptyComment) {
            comment.classList.add('is-invalid');
        } else {
            comment.classList.remove('is-invalid');
        }

        if (isEmptyEmail) {
            email.classList.add('is-invalid');
        } else {
            email.classList.remove('is-invalid');
        }

        if (!isValidEmail) {
            email.classList.add('is-invalid');
        } else {
            email.classList.remove('is-invalid');
        }

        return;
    }

    // create an object for new comment
    const newObject = {
        "email": email.value,
        "color": color.value,
        "comment": comment.value
    }

    // append new comment to comment corner
    appendComment(newObject);

    // save new comment to the json file
    loadComments()
        .then(comments => {
            let newArray = comments.concat(newObject);
            fetch("./comment_data.json", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newArray)
            })
        })
        .catch(err => {
            console.log(err);
        });

    // blank the form
    document.querySelector("form").reset();
}

// once refresh the page, load all comments and display them
document.addEventListener("DOMContentLoaded", function () {
    loadComments()
        .then(comments => {
            comments.forEach(comment => {
                appendComment(comment);
            });
        })
        .catch(err => {
            console.log(err);
        });
});

// load comments from the json file
function loadComments() {
    return fetch('./comment_data.json')
        .then(response => {
            return response.json(); // .json() should be awaited
        })
        .then(data => {
            if (Array.isArray(data)) {
                return data;
            } else {
                throw new Error("The JSON file does not exist, or the data is not stored in the array.");
            }
        })
        .catch(err => {
            console.log(err);
            return initCommentsJson();
        })
}

// append comments to comment corner
function appendComment(comment) {
    let newComment = document.createElement("div");
    let element = '<div><svg height="60" width="60"><circle cx="30" cy="30" r="20"></svg></div><div><h5></h5><p></p></div>';
    newComment.innerHTML = element;

    newComment.className = "d-flex";
    newComment.querySelectorAll("div")[0].className = "flex-shrink-0";
    newComment.querySelectorAll("div")[1].className = "flex-grow-1";

    newComment.querySelector("h5").innerHTML = comment.email;
    newComment.querySelector("p").innerHTML = comment.comment;

    let color = comment.color;
    newComment.querySelector("circle").setAttribute("fill", color);

    document.querySelector("#commentList").appendChild(newComment);
}

// create and init the comment_data.json (the data must be store in array)
function initCommentsJson() {
    const newObject = [
        {
            "email": "admin@gmail.com",
            "color": "red",
            "comment": "Welcome to give comments here!"
        }
    ]
    fetch("./comment_data.json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newObject)
    })
    return newObject;
}