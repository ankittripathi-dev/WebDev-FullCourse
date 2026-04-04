/* (1) Write a program to check if a number is even or odd. */

    // Approach-1
    // step-1
    let num = prompt('Enter Your Number')   // prompt always return string 
    console.log(typeof num);  // string

    // step-2
    num = Number(num)   
    console.log(typeof num); // Number
        
    // step-3
    if(num%2===0){
        console.log(`${num} is Even Number`);
    }else{
        console.log(`${num} is Odd Number`);  
    }
       
    
    // Aapproach-2
    var number = 10;
    var number = 11
    if (number % 2 === 0) {
        console.log(`${number} is Even Number`);
    } else {
        console.log(`${number} is Odd Number`);  
    }
    

    // Approach-3
    const checkEvenOdd = (number) => {
    if (number % 2 === 0) {
        console.log(`${number} is Even Number`);
    } else {
        console.log(`${number} is Odd Number`);
    }
    }
    checkEvenOdd(10)
     

    // Approach-4
    const checkEvenOddNum = (num) => {
      num % 2 === 0 ? console.log(`${num} is Even Number`): console.log(`${num} is Odd Number`)
    }
    checkEvenOddNum(173)

/* Notes: 
(1) prompt()=> always returns string value.
let number = prompt("Enter the number");
console.log(typeof number); // "string"

Why does number%2===0 works => This work because of type coercion in JavaScripts.
% (modulus) operator with a string, JavaScript automatically tries to convert string into a number.
For Example:-
"10" % 2 → JS converts "10" to 10, then does 10 % 2 → result 0.
That’s why your code works even if number is a string.
*/


/*
 isNaN() is a built-in function that checks whether a value is NaN (Not-a-Number).
📌 How it works:
isNaN(value) → returns true if the value is NaN or cannot be converted to a number.
Otherwise, it returns false.
*/