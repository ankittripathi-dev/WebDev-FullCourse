//!  for-of loop, the variable directly refers to the values of the array

// Examle.1
const fruits = ["apple", "orange", "banana"];

for (let value of fruits) {
  console.log(value);
}
// => apple
// => orange
// => banana

// Example.2 
const greeting = 'Hello';

for (let char of greeting) {
  console.log(char);
}


// Example.3
for (let char of 'Himesh') {
  console.log(char);
}
