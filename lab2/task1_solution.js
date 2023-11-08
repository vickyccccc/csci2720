{
    let x = prompt("What is your age?");
    // Validate the input
    if (!isNaN(x) && parseInt(x) <= new Date().getFullYear())
    {
        let y = new Date().getFullYear();
        let z = y - x;
        alert("I guess you were born in " + z);
    }
    else
    {
        alert("Invalid input. Please enter a valid year of birth.");
    }
}