// (3) Reverse a string without using .reverse()

// Approach -1 Using for loop
let str = 'Hello World'
let reversed = ''

for (let i = str.length-1; i>=0; i--){
    reversed = reversed + str[i]
    // console.log(reversed);
}
console.log(reversed);   // output:- dlroW olleH


// Arrpoach-2 Using reduce
let name = 'Ankit'
console.log(typeof name);   // string

let reverse = name.split('')
console.log(typeof reverse);  // obejct
console.log(reverse);         // ['A', 'n', 'k', 'i', 't']

let answer = reverse.reduce((rev, char)=>{
    return char + rev
},'')
console.log(answer);


/* Notes:-
Why split("") is needed?
A string in JavaScript is not directly iterable with array methods
like .reduce(), .map(), .filter().
So, if we convert the string into an array of characters, then we can use all array methods.

🔎Dry Run step by step:
Array = ['A', 'n', 'k', 'i', 't']
Initial rev = ''
char = 'A' → rev = 'A' + '' → 'A'
char = 'n' → rev = 'n' + 'A' → 'nA'
char = 'k' → rev = 'k' + 'nA' → 'knA'
char = 'i' → rev = 'i' + 'knA' → 'iknA'
char = 't' → rev = 't' + 'iknA' → 'tiknA'\
*/


// (3) Reverse a string using .reverse() method
let greet = 'good'

// Step-1: Convert string into array of characters
let result = greet.split("")
console.log(result);

// Step-2: Reverse the array
let reverseArray = result.reverse()
console.log(reverseArray);

// Step-3: Join the array back into a string
let reversedStr = reverseArray.join('')

// Final Output
console.log(reversedStr); // "doog"