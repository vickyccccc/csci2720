{
    let a = ["red", "pink", "green"];

    // Using splice to delete "pink" and add "orange" and "yellow"
    a.splice(1, 1, "orange", "yellow");
    
    // Asking the user for an extra color and storing it at the end of the array
    let extraColor = prompt("Enter an extra color:");
    a.push(extraColor);
    
    // Sorting the array and storing the sorted results in another variable
    let sortedArray = a.slice().sort();
    
    // Printing the array using a for...of loop and document.write()
    for (let color of sortedArray)
    {
      document.write(color + "<br>");
    }
}