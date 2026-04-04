/* 
(1) Give a string, reverse each word in the sentence. 
"Ankit bhai kaise ho"
*/
let str = "Hello ji kaise ho"
let reverseStr = ''

for(let i = str.length-1; i>=0; i--){
    reverseStr = reverseStr + str[i]
}
console.log(reverseStr);   // output: oh esiak ij olleH


// Method-1:- map always return new array
let myStr = 'Ankit kaise ho'
let savedStr = myStr.split(" ").map((word)=> {
    return word.split("").reverse().join("")
})
console.log(savedStr.join(" "));



// (2) How to check if an object is array or not ? Provide some code.
function checkArray(elem){
    return Array.isArray(elem)
}
console.log(checkArray([]));  // output: true
console.log(checkArray({}));  // output: false

/*
Notes: retrun ka matlab hota hai oha pe wapas jawo jaha ke wajah se function chala hai.
*/


// (3) How to empty an array in javaScripts ? do not reset it to a new array, and do not loop through to pop each value
// method-1
let cities = ['delhi', 'noida', 'gudgaon', 'jaipur']
console.log(cities.length);  // 4

cities.length = 0
console.log('cities =', cities);

// method-2
let array = [1, 2, 3, 4, 5]
for(let  i = array.length-1; i>=0; i-- ){
    array.pop()
    console.log(array); 
}
console.log('finalArray =', array);


/* 
(4) How to check if a number is an integer ?
 Integers value => zero, positive, negative
 float value => fractional value, decimal value
*/
const checkNumber = (num)=>{
    return Number.isInteger(num)
}
console.log(checkNumber(3));   // true
console.log(checkNumber(0));   // true
console.log(checkNumber(-11)); // true
console.log(checkNumber(3.2)); // false
console.log(checkNumber(1/2)); // false


// Method-2
var num = 12;
if(num%1 === 0){
  console.log('integer');
} else{
  console.log('not a integer');
}

/* (5) Make this work:
   duplicate this ([1, 2, 3, 4, 5]), that will gives output [1, 2, 3, 4, 5, 1, 2, 3, 4, 5]
*/

// Method-1
function duplicate(arr){
    console.log(arr.concat(arr));
}
duplicate([1, 2, 3, 4, 5])

// Method-2
let fruits = ['apple', 'banana', 'grapes', 'leechi']
let answer = fruits.concat(fruits)
console.log(answer);


// Functions 
// (6) Write a javaScript function that reverse a number
function reverseKaro(num){
    let str = num.toString()
    let arrayStr = str.split('')
    let reverseStr = arrayStr.reverse()
    let finalReverse = reverseStr.join("")
    console.log(typeof finalReverse);

    let finalReverseInNumber = Number(finalReverse)
    console.log(finalReverseInNumber);
    console.log(typeof finalReverseInNumber);
}
reverseKaro(12)
// reverseKaro("72")


// method-2
let reverseNumber = (num)=>{
    let rev = 0
    while(num>0){
        var rem = num%10   // 4   // 3   // 2  // 1
        rev = rev*10+rem   // 4   // 43  // 4321
        num = Math.floor(num/10)  // 123  // 12  // 1  // 0
    }
    return rev
}
console.log(reverseNumber(1234));


// (7) Write a javaScript function that checks wheather a passed string is palidrome or not
/* 
Notes:-
palindromic number/string is a number/string that remains the same when its digits are reversed.
For example:- lool, 16361
*/
const palidromeChecker = (str)=>{
    let reversedStr = str.split('').reverse().join('')
    // console.log(reversedStr);
    // return reversedStr === str ? true : false
    return reversedStr === str
}
console.log(palidromeChecker('lool'));   // true
console.log(palidromeChecker('cool'));   // false
console.log(palidromeChecker('16361'));  // true


// (8) Write a JavaScripts function that returns a passed string with letters in alphabetical order.
// For Example:- apple => aelpp
const stringAlphabeticalOrder = (str)=>{
    let ascendingOrder = str.split('').sort().join('')
    console.log(ascendingOrder);
} 
stringAlphabeticalOrder('apple')
stringAlphabeticalOrder('mango')


/* 
 (9) Write a JavaScripts function that accepts a string as a parameter and converts the first letter of each word of the string in UpperCase.
Example:- ankit bhai kaise ho => Ankit Bhai Kaise Ho
*/

function capitalizeKaro(str){
   let allWords = str.split(" ").map((word)=>{
    return word.charAt(0).toUpperCase() + word.substring(1)
   })
   return allWords.join(" ")
}
console.log(capitalizeKaro('ankit bhai kaise ho'));



/*
(10) Write a JavaScripts function which accepts an argumnets and returns the type.
Note: There are six possible values that typeof returns: object, boolean, function, number, string, undefined.
*/
function typeTeller(arg){
    console.log(typeof arg);
}
typeTeller([]);            // object
typeTeller(12)             // number
typeTeller('12')           // string
typeTeller(true);          // boolean
typeTeller();              // undefined
typeTeller(undefined)      // undefined
typeTeller(function (){})  // function


/*
(11) Write a JavaScripts function to get the number of occurrences of each letter in specified string
Example: apple => a=1, p=2, l=1, e=1
*/
function occurrences(str){
    let occuanceObj = {}
    let  result = str.split("").forEach((elem)=>{
        if(occuanceObj.hasOwnProperty(elem) === false){
            occuanceObj[elem] = 1
        }
        else{
            occuanceObj[elem]++
        }
    })
   return occuanceObj
}
console.log(occurrences('apple'));
console.log(occurrences('shivajitheboss'));



