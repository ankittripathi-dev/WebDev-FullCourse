// Function:- function is a reusable block of code designed to perform a specific task.
function greet(name){
    console.log(`hello ${name}`);
}
greet('Ankit')  // arguments
   
/*
 (1) Write a function named 'makeTea' that takes one parameter, 'typeOfTea' and returs a string like 'Making green Tea' when called with 'green tea'.
 Store the result in a variable named 'teaOrder'.
*/
function makeTea(typeOfTea){
    return `Making ${typeOfTea}`
    console.log('hello');  // will never execute
}
let teaOrder = makeTea('green tea')
console.log(teaOrder);

/* Notes:
 Ques:- Why code after return does not execute?
  - In JavaScripts, return means:- “Exit the function immediately and give back the value.”
  - line written after return becomes dead code and will never run.

  makeTea() // function call / function Execution
  makeTea   // Reference passed / function reference
*/


/*
 (2) Create a function named 'orderTea' that takes one parameter, 'teaType'. Inside this function, create another function named 'confirmOrder' that returns a message like 'Order confirmed for chai'.
 Call 'confirmOrder' from within 'orderTea' and return the result.
*/
function orderTea(typeOfTea){
    function confirmOrder(){
        return `Order confirm for chai` 
    }
    return confirmOrder()
}
let result = orderTea()
console.log(result);

/*
Arrow function:- shorter way to write functions, introduced in ES6.

const functionName = (parameters) => {
   // code block
   return value;
}
*/

/* 
(3) Write an arrow function named 'calculateTotal' that takes two parameters: 'price and 'quantity. The function should return the total cost by multiplying the 'price' and 'quantity'.
Store the result in a variable named 'totalCost'
*/
const calculateTotal = (price, quantity)=>{
    return price * quantity
}
let totalCost = calculateTotal()
console.log(totalCost);

/*
 Implicit return means you return a value without explicitly writing the return keyword.
 This works when the function body is a having single expression.
*/
const calculateTotals = (price, quantity)=> price * quantity
let totalCosts = calculateTotals(10, 10)
console.log(totalCosts);

/*
 (4) Write a function named `processTeaOrder` that takes another function, `makeTea`, as a paramter and calls it with the argument 'earl grey'. 
 Return the result of calling `makeTea`.
*/
function makeTea(typeOfTea){
    return `MakeTea: ${typeOfTea}`
}

function processTeaOrder (teaFunction){
    return teaFunction('earl grey')  // called with arguments
}
let order = processTeaOrder(makeTea)
console.log(order);

/* Brakdown: 
processTeaOrder(makeTea)
      ↓
teaFunction = makeTea
      ↓
teaFunction('earl grey')
      ↓
makeTea('earl grey')
      ↓
"MakeTea: earl grey"
      ↓
returned → stored in order
      ↓
console.log(order)
*/


/* 
  What is a High-Order Function?
- A High-Order Function (HOF) is a function that either:
- Takes another function as an argument (callback), OR
- Returns another function.
- In short → functions that work with other functions.
*/
function greet(name){
    return `Hello, ${name}`
}

function processUserInput(callback){
    let name = 'Ankit'
    return callback(name)
}
console.log(processUserInput(greet));

/*  Common Built-in HOFs in JavaScript
    Array methods like .map(), .filter(), .reduce() are all High-Order Functions.
*/

// map → applies a function to each element
let numbers = [1, 2, 3, 4, 5];
let doubled = numbers.map(num => {
   return num * 2
});
console.log(doubled); // [2, 4, 6, 8, 10]


// filter → returns elements that match condition
let evens = numbers.filter(num => num % 2 === 0);
console.log(evens);  // [2, 4]

// reduce → reduces array to a single value
let sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum);     // 15

/*
(5) Write a function named `createTeaMaker` that returns another function. The returned function should take one parameter, `teaType`, and return a message like `Making green tea`.
Store the returned function in a variable named 'teaMaker' and call it with `green tea`.
*/
function createTeaMaker(){
    return function(teaType){
        return `Making ${teaType}`
    }
}
let teaMaker = createTeaMaker()
let answer = teaMaker('green tea')
console.log(answer);


