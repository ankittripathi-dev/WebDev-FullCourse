// (1) Array.shift():- modify the original Array Lists
const array1 = [1, 2, 3]
const firstElement = array1.shift();
console.log(firstElement);  // 3
console.log(array1);        // [1, 2]

// (2) Array.unshift() :-
let array = [1, 2, 3]
console.log(array.unshift(4, 5));  // 5
console.log(array);  // [4, 5, 1, 2, 3]
