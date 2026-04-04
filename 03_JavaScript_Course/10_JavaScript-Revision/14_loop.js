// Conditional:- 
// while
// do-while
// for
// for-in
// for-of
// forEach

/*
Syntax:- 

// start
while (//condition) {
    // code block to be executed
    // increment
}
*/


/*
(1) Write a 'while' loop that calculates the sum of all numbers from 1 to 5 and stores the result in a variable named 'sum'
*/

let sum = 0;
let i = 1;

while(i <= 5){
    sum +=i   // sum = sum + i
    i++
}
console.log(sum);  // 15


/*
(2) Write a 'while' loop that counts down from 5 to 1 and stores the numbers in an array named 'countdown'.
*/

let countdown = []
let m = 5;
while(m > 0){
    countdown.push(m)
    m--
}
console.log(countdown); // [5, 4, 3, 2, 1]

/* 
(3) Write a 'do While' loop that prompts a user to enter their favorite tea type until they enter 'stop'.
Store each tea type in an array named 'teaCollection'
*/
// let teaCollection = []
// let tea

// do{
//   tea =  prompt(`Enter Your fabourite tea (type "stop" to finish)`)
//   if(tea !== 'stop'){
//     teaCollection.push(tea)
//   }
// }while(condition)

/*
(4) Write a 'do while' loop that adds numbers from 1 to 3 and stores the result in a variable named 'total'.
*/

let total = 0;
let k = 1;
do{
    total = total + k;  // 0+1 => 1+2 => 3+3 = 6
    k++
} while(k <= 3)
console.log(total);  // 6


/*
(5) Write a 'for' loop that multiplies each element in the array `[2, 4, 6]` by 2 and stores the results in a new array named 'multipliedNumbers'
*/

let multipliedNumbers = []
let numbers = [2, 4, 6]

for(let l=0; l<numbers.length; l++){
    takeNumber = numbers[l] * 2;
    multipliedNumbers.push(takeNumber)
}
console.log(multipliedNumbers);

// for (let l = 0; l < numbers.length; l++) {
//     const element = numbers[l];
// }

/*
(6) Write a `for` loop that lists all the cities in the array `['paris', 'New York', 'Tokyo', 'London']` and store each city in a new array named `cityList`.
*/
let cities = ['paris', 'New York', 'Tokyo', 'London']
let cityList = []

for (let c = 0; c < cities.length; c++) {
    const myCity = cities[c];
    cityList.push(myCity)
}
console.log(cityList);