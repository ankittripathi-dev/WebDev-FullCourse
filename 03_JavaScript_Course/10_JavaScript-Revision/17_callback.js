// A callback function is simply a function that is passed as an argument to another function and is executed later (after some operation is done).

// Example.1
function greet(name, TeabanaDiya){
    console.log(`Hello, ${name}`);
    TeabanaDiya()
}

function makeTea(){
    console.log('Make a cup of Tea');
}

greet('Ankit', makeTea)  // passed 

/* Output:- 
Hello, Ankit
Tea is Ready
*/


// Example.2
function Country(name, callback) {
    console.log('Hello', name)
    callback()  // exteuted later
}


function sayBye() {
    console.log("Goodbye");
}
        
Country('India', sayBye)  // function passed as argumnets 