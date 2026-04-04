/*
(1) Declare an array named 'teaFlavors' that contains that strings 'green tea', 'black tea', and 'oolong tea'. Access the first element of the array and store it in a variable name 'firstTea'
*/
// method-1
let teaFlavors = ['green tea', 'black tea', 'oolong tea']
let firstTea = teaFlavors[0]
console.log(firstTea);    // green tea

// method-2
let teaFlavour = new Array('green tea', 'black tea', 'oolong tea')
console.log(teaFlavour);


/*
(2) Declear an array named 'cities' containing 'London', 'Tokyo', 'Paris', and 'New York'. Access the third element in the array and store it in a variable named 'favouriteCity'.
*/ 
let cities = ['London', 'Tokyo', 'Paris', 'New York']
let favouriteCity = cities[2]
console.log(favouriteCity);   // Paris


/*
(3) You have an array named 'teaTypes' conatining 'herbal tea', and 'masala chai'. Change the second element of the array to 'jasmine tea'
*/
let teaTypes = ['herbal tea', 'masla chai']
console.log(teaTypes);  // [ 'herbal tea', 'masla chai' ]

teaTypes[1] = 'jasmine Tea'
console.log(teaTypes); // [ 'herbal tea', 'jasmine Tea' ]


/*
(4) Decleare an array named 'citiesVisited' containing 'Mumbai' and 'Sydney'. Add "Berlin" to the array using the 'push method
*/
let citiesVisited = ['mumbai', 'Sydney']
citiesVisited.push('Berlin')
console.log(citiesVisited); //[ 'mumbai', 'Sydney', 'Berlin' ]

/*
(5) You have an array named 'teaOrders' with 'chai', 'ice tea', 'matcha' and 'earl grey'. Remove the last elements of the array using the 'pop' method and store it in a variable named 'lastOrder.
*/
let teaOrders = ['chai', 'ice tea', 'matcha', 'earl grey']
let lastOrder = teaOrders.pop()
console.log(lastOrder);  // earl grey

/*
(6) You have an array named 'popularTeas' containing 'green tea' 'oolong tea' and 'chai'. Create a soft copy of this array named 'softCopyTeas'.
*/
let popularTeas = ['green tea', 'oolong tea', 'chai']
let softCopyTeas = popularTeas; // <- not a real "copy", just another reference
console.log(popularTeas);  // ['green tea', 'oolong tea', 'chai']
console.log(softCopyTeas); // ['green tea', 'oolong tea', 'chai']

popularTeas[2] = 'coofee' // changing index 2 in the original array

console.log(popularTeas); // ['green tea', 'oolong tea', 'coffee']
console.log(softCopyTeas); // ['green tea', 'oolong tea', 'coffee']

/* Notes:-
- Arrays (and objects) in JavaScript are non-primitive data types.
- Non-primitives are stored by reference in memory.
- When we do:
  let softCopyTeas = popularTeas;

- it does not create a new memory location.
- Both variables (popularTeas and softCopyTeas) now point to the same memory address.
- So, if we change the array using one variable, the other variable also sees the change (because both refer to the same array in memory).


Difference from arrays/objects:
- Primitive types → stored by value (separate memory).
- Non-primitive types (arrays, objects, functions, etc.) → stored by reference (same memory address can be shared).
*/


/* 
(7) You have an array named 'topCitis' containing 'Berlin', 'Singapore', and 'New York'. Create a hard copy of this array named 'hardCopycities'
*/
let topCities = ['Berlin', 'Singapore', 'New York'];

// Create a hard copy using spread
let hardCopyCities = [...topCities];

console.log(topCities);       // [ 'Berlin', 'Singapore', 'New York' ]
console.log(hardCopyCities);  // [ 'Berlin', 'Singapore', 'New York' ]

// Modify original array
topCities.pop();

console.log(topCities);       // [ 'Berlin', 'Singapore' ]
console.log(hardCopyCities);  // [ 'Berlin', 'Singapore', 'New York' ]


/*
🔑 Why it works:
Your code is absolutely correct for making a hard copy (shallow copy) of an array using the spread operator (...).

let hardCopyCities = [...topCities]
Copies all elements of topCities into a new array.
When you call topCities.pop(), only the original array changes.
Since hardCopyCities is an independent copy, it remains unchanged.

👉 This is different from reference copy (e.g., let hardCopyCities = topCities), where both variables point to the same memory location.

⚠️ Note: The spread operator makes a shallow copy, meaning:

Works perfectly for primitive values (strings, numbers, booleans).

But if your array has objects or nested arrays, the inner objects are still shared (not deeply copied).
*/


/*
 (8) You have two arrays: 'europeanCities' conatining 'Paris', and 'Rome', and 'asianCities' containing 'Tokyo' and 'Bangkok'.
Merge these two arrays into a new array named 'worldCities'.
*/ 
let europeanCities = ["paris", 'Rome']
let asianCities = ['Tokyo', 'Bangkok']

// let worldCities = [...europeanCities, ...asianCities] 
let worldCities = europeanCities.concat(asianCities)
console.log(worldCities);   // [ 'paris', 'Rome', 'Tokyo', 'Bangkok' ]
console.log(typeof worldCities); // object

/*
(9) You have an array named 'teaMenu' containing 'masala chai', 'oolong tea', 'green tea', and 'earl grey'. Find the length of the array and store it in a variable named 'menuLength'.
*/
let teaMenu = ['masala chai', 'oolong tea', 'green tea', 'earl grey']

let menuLength = teaMenu.length
console.log(menuLength);

/*
(10) You have an array named 'cityBucketList' containing 'Kyoto', 'London' 'Cape Town' and 'Vancouver'. Check if 'London' is in the array and store the result in a variable named 'isLondonList'.
*/

let cityBucketList = ['Kyoto', 'London', 'Cape Town', 'Vancouver']

let isLondonList = cityBucketList.includes('London')
console.log(isLondonList);   // true  

let isLondonLists = cityBucketList.includes('london')
console.log(isLondonLists);  // false

let isGurugramList = cityBucketList.includes('Gurugram')
console.log(isGurugramList);  // false

