/*
 (2) Non-Primitive Data Types:-
 - Non-primitives are stored by reference, not by value.
 - They are mutable → their contents can be changed after creation.
 - Two or more variables can point to the same object in memory.
 - We can't change the memory reference itself, but can change the values inside it.

(1) object
(2) Array
(3) Function
(4) Date
(5) Map

*/

// (1) object:- collection of key values pairs
// Example.1 Empty object 
let obj = {}
console.log(obj);          // {}
console.log(typeof obj);   // object


// Example.2
let userName = {
  name:'Mahi',
  isLoggedIn: true
}
console.log(userName);            // { name: 'Mahi', isLoggedIn: true }
console.log(userName.name);       // Mahi
console.log(userName.isLoggedIn); // true


// Updating key value Pairs
userName.name = 'Ankit'

// Adding new key value Pairs
userName.surName = 'Tripathi'
console.log(userName); //   { name: 'Ankit', isLoggedIn: true, surName: 'Tripathi' }
console.log(typeof userName); // object


// Example.3
let person = {
  'first Name':'Ram',
  isActive: true,
}  
console.log(person);  // { first Name: 'Ram', isActive:true }
console.log(person['first Name']);


// (2) Date
let today = new Date();
console.log(today.getDate());
console.log(typeof today);    // object

// (3) Array:- Collection of Items
let anotherUser = ['Ankit', 'Tripathi', true]
console.log(anotherUser);        // [ 'Ankit', 'Tripathi', true ]
console.log(typeof anotherUser); // object

console.log(anotherUser[0]);  // Ankit
console.log(anotherUser[1]);  // Tripathi

// Adding a New Element by Index
anotherUser[3] = 'Gurugram'
console.log(anotherUser); // [ 'Ankit', 'Tripathi', true, 'Gurugram']

