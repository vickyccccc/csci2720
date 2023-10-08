var showOrHide = 0;

function q3task0() {
    if (showOrHide == 0) {
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

function q3task2() {
    let prompt = prompt("Please enter a spotlight of the celebrity");

    if (prompt != null) {
        document.getElementById("demo").innerHTML =
            "Hello " + person + "! How are you today?";
    }
}