/* Difference between let, var, const */
// (1) let:- Can't be re-redecleared but can be re-assign.
let gameName = 'spiderman'
// let gameName = 'batman'  // can't be re-decleared
gameName = 'batman'         // can be re-assign
console.log(gameName);      // batman


// (2) const:- Can't be re-decleared and re-assign
const userName = 'ankittripathi.dev'
// const userName = 'ankit.dev'  // can't be re-recleared
// userName = 'ankit.dev'        // can't be re-assign
console.log(userName);           // ankittripathi.dev


// (3) var:- var can be re-decleared and re-assign
var company = 'apple'
console.log(company);   // apple

var company = 'acer'    // can be re-decleared
console.log(company);   // acer

company = 'dell'       // can be re-assign
console.log(company);  // dell
