
// (12) Loops an array and add all members of it.
let array = [1, 2, 3, 4, 5]
let sum = 0;

array.forEach((elem)=>{
    sum = sum + elem;
})
console.log(sum);

// Method-2
// for(let i = 0; i<array.length; i++){
//     sum = sum + array[i]
// }
// console.log(sum);


// (13) In an array of numbers and strings, only add those members which are not strings.
let arr = ['leechi', 7, 'apple', 'mango', 'orange', 3, 10]
let mySum = 0;

arr.forEach((elem)=>{
    if(typeof elem === 'number'){
        mySum = mySum + elem 
    }
})
console.log('mySum =', mySum);


// (14) loop an array of objects and remove all objects which don't have gender's value male.
let array1 = [
    {name:'Ankit', gender: 'male'}, 
    {name:'Ankita', gender: 'female'}, 
    {name:'Isha', gender: 'nonspecified'}, 
    {name:'purvi', gender: 'female'}, 
    {name:'Uma', gender: 'female'}, 
]

let newArray = array1.filter((elem)=>{
    return elem.gender === 'male'
})
console.log(newArray);    

array1 = newArray
console.log(array1);
console.log(newArray);

