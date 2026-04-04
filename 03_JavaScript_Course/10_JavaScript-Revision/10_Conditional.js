// Example.1 Check if a number is greater than another number.
let num1 = 5;
let num2 = 8;

console.log("I am regular upper code");

if (num1 > num2) {
  console.log("num1 is greater than num2");
} else {
  console.log("Nope, num1 is NOT greater");
}
console.log("I am regular bottom code");


// Example.2 Checking if a string is equal to another string.
let userName = "Chai";
let anotherUserName = "Chai";

if (userName != anotherUserName) {
  console.log("Pick another username");
} else {
  console.log("You can pick this username");
}

// Example.3 Check if a variable is a number or not
let score = 44;

if (typeof score === "number") {
  console.log("Yep, this is a number");
} else {
  console.log("No, that is not a number");
}

// Example
let scores = "44";

if (typeof scores === "number") {
  console.log("Yep, this is a number");
} else {
  console.log("No, that is not a number");
}

// Example.4
let scored = [];
console.log(typeof scored); // object

if (typeof scored === "array") {
  console.log("Yep, this is a array");
} else {
  console.log("No, that is not a array");
}


if (typeof scored === "object") {
  console.log("Yep, this is a array");
} else {
  console.log("No, that is not a array");
}


// Example.5 Check if a boolean value is true or false
let isTeaReady = false;

if (isTeaReady) {
  console.log("Tea is Ready");
} else {
  console.log("Tea is Not Ready");
}

// Example.6  Check if an array is empty or not
let items = []
console.log(items.length);   // 0

if(items.length === 0){
    console.log('Array is Empty');
} else{
    console.log('Array is Not Empty');
}

// Example.2
let fruits = ['apple']

if(fruits.length === 0){
    console.log('Array is Empty');
} else{
    console.log('Array is Not Empty');
}
