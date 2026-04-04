/* (1) Primitive DataTypes
 - They represent single values (not objects).
 - They are immutable, which means their actual values can't be changed.
 - Once created, their values cannot be changed (only reassigned).
(a) Number:- 2, 2.5, 0, -10, +10
(b) string:- single quotes, double quotes, or back ticks.
(c) boolean:- true, false.
(d) undefined:- variable decleared, but value not defined yet.
(e) null:- standalone value.
(f) BigInt:- 
(g) Symbol:- 
*/

// (1) Number
// Example.1
let balance = 500;
console.log(balance);        // 500
console.log(typeof balance); // number

// Example.2
let anotherBalance = new Number(100)    // not recommended
console.log(anotherBalance.valueOf());  // 100
console.log(typeof anotherBalance);     // object

// (2) boolean
// Example.1
let isActive = true;
console.log(isActive);        // true
console.log(typeof isActive); // boolean

// Example.2
let isReallyActive = new Boolean(true)  // not recommended
console.log(isReallyActive.valueOf());  // true
console.log(typeof isReallyActive);     // boolean

// (3) String => '', "", ``
let myString = "Hello"
let userName = 'Ankit'

let oldGreet = myString + " " + "Ankit"
console.log(oldGreet);   // Hello Ankit

// String concatenation:- The process of combining two or more string using + operator
let str1 = 'Good'
let str2 ='Morning'
let result = str1 + ' ' + str2;
console.log(result);  // Good Morning

// String Interpolation:-
let st1 = "Hello";
let st2 = "World";
let answer = `${st1} ${st2}`;  // Interpolation using template literals
console.log(answer);  // Hello World

let demoOne = `Value of 2*2 = ${2 * 2}`
console.log(demoOne);  // 4


// (4) undefined: - decleared but value not define
let carModel
console.log(carModel);  // undefined

let carPrice = undefined;
console.log(carPrice);         // undefined
console.log(typeof carPrice);  // undefined


// (5) null:- standalone value
let firstname = null
console.log(firstname);         // null
console.log(typeof firstname);  // object

// (6) Symbol => Built-in object whose constructor returns a Symbol. It always Unique.
let sm1 = Symbol('Ankit')
console.log(sm1);          // Symbol(Ankit)

let sm2 = Symbol('Ankit')
console.log(sm2);          // Symbol(Ankit)

console.log(sm1 == sm2);   // false



/*
In JavaScript (strings, numbers, booleans, null, undefined, symbol, bigint) are primitive data types.
- Primitives are stored by value, not by reference.
- That means when you do:
let var1 = 'hello';
let var2 = 'world';

- var1 gets its own memory location (say 0x2001) with the value 'hello'.
- var2 gets a separate memory location (say 0x2002) with the value 'world'.

var1 => own memory location (say 0*2001)
var2 => own memory location (say 0*2002)

Now:
- var2 = 'Namaste';
- This replaces only the value of var2.
- var1 is unaffected because it lives in a different memory location.
*/

var1 = 'Ankit'     // have seperate memory location
var2 = 'Chandu'    // have seperate memory location
console.log(var1);
console.log(var2);
  

var2 = 'shyam'   // actual value change
console.log(var1);
console.log(var2);


/* (2) Non-Primitive DataTypes(Refrence DataTypes):-
A non-primitive data type in JavaScript is a data type that does not store the actual value directly, but instead stores a reference (address) to the value in memory.

(a) object => {}
(b) Array = []
(c) functions
(d) Map
(e) Date
*/



/*
Difference from arrays/objects:
- Primitive types → stored by value (create a separate memory location).
- Non-primitive types (arrays, objects, functions, etc.) → stored by reference (same memory address can be shared).
*/