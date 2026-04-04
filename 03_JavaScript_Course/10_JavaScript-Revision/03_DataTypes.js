// Data Structure:- The way of organizing and storing data in a computer
// Data Types: The way of storing(holding) data in a variable.

/*
(1) Primitive Data Types (immutable):-
 -  They represent single values (not objects).
 -  And are immutable, which means their actual values can't be changed.
(a) Number:- 2, 2.5, 0, -10, +10
(b) string:- single quotes, double quotes, or back ticks.
(c) boolean:- true, false.
(d) BigInt:- Large-integer.
(e) undefined:- variable decleared, but value not defined yet.
(f) null:- standalone value.
(g) Symbol:-
*/

/*
 (1) Number:- Numeric values (integers, floats)
 (a) Integers:- represent exact whole values, including negatives, zero, and positives
    Example: -0, 0, +1, 5

 (b) float:- represent numbers that include decimal fractions,
    Example: 3.14 or -2.5
*/

// (a) Integers
// Example.1
let score = 100
console.log(score);         // 100
console.log(typeof score);  // number

// Example.2
let score2 = -100
console.log(score2);         // -100
console.log(typeof score2);  // number


// (b) float
// Example.1
let float = 3.14
console.log(float);          // 3.14
console.log(typeof float);   // number


// (2) string:- Textual data
// Example.1
let name1 = 'Ankit'
console.log(name1);         // Ankit
console.log(typeof name1);  // string

// Example.2
let name2 = `Ram`
console.log(name2);         // Ram
console.log(typeof name2);  // string


// (3) boolean:- Logical value => true, false
let isLoggedIn = true;
console.log(isLoggedIn);        // true
console.log(typeof isLoggedIn); // boolean


/*
 (2) Non-Primitive Data Types:-
 - Non-primitives are stored by reference, not by value.
 - They are mutable → Their contents can be changed after creation.
 - Two or more variables can point to the same object in memory location.
 - We can't change the memory reference itself, but can change the values inside it.
 
(1) object
(2) Array
(3) Function
(4) Date
(5) Map
*/

// (a) object:- collection of key value pairs.
let object = {
    firstName:'Ankit',
    lastName:'Tripathi'
}
console.log(object.firstName);   // Ankit
console.log(object.lastName);    // Tripathi


// (b) Array:- 
let teaTypes = ['orange Tea', 'lemon Tea', 'oolang Tea']
console.log(teaTypes[0]);  // orange Tea
console.log(teaTypes[2]);  // lemon Tea
