/*
(1) Write a `for` loop that loops through the array ['green tea', 'black tea', 'chai', 'oolong tea'] and stop the loop when it finds `chai`.
Store all teas before `chai` in a new array named `selectedTeas`.
*/
let teas = ['green tea', 'black tea', 'chai', 'oolong tea']
let selectedTeas = []

for(let i=0; i<teas.length; i++){
    // console.log(teas[i]);
    if(teas[i] === 'chai'){
        break;
    }
    selectedTeas.push(teas[i])
}
console.log(selectedTeas);   // output: [ 'green tea', 'black tea' ]


/* 
(2) Write a for loop that loops through the array ["London", "New York", "Paris", "Berlin"] and skips "Paris".
Store the other cities in a new array named visitedCities.
*/
let cities = ['London', 'New York', 'Paris', 'Berlin']
let visitedCities = []

for(let i=0; i<cities.length; i++){
    if(cities[i]=== 'Paris' || cities[i] === 'paris'){
        continue
    }
    visitedCities.push(cities[i])
}
console.log(visitedCities);  // output: [ 'London', 'New York', 'Berlin' ]


/* 
(3) Use a for-of loop to iterate through the array [1, 2, 3, 4, 5] and stop when the number 4 is found.
Store the numbers before 4 in an array named smallNumbers.
*/
let numbers = [1, 2, 3, 4, 5]
let smallNumbers = []

for(const num of numbers){
    if(num === 4){
        break
    }
    smallNumbers.push(num)
}
console.log(smallNumbers);  // output: [ 1, 2, 3 ]


/*
(4) Use a for-of loop to iterate through the array ["chai", "green tea", "black tea", "herbal tea"] and skip 'herbal tea'.
Store the other teas in an array named preferredTeas.
*/
let teaTypes = ["chai", "green tea", "black tea", "herbal tea"]
let preferredTeas = []

for(const tea of teaTypes){
    if(tea === "herbal tea"){
        continue
    }
    preferredTeas.push(tea)
}
console.log(preferredTeas);

/*
(5) Use a for-in loop to loop through an object containing city populations.
Stop the loop when the population of "Berlin" is found and store all
previous cities' population in a new object named "cityNewPopulations".

let cityPopulation = {
"London": 8900000,
"New York": 8400000,
"Berlin": 3500000,
"Paris": 2200000
}
*/
let cityPopulation = {
    London: 8900000,
    "New York": 8400000,
    Berlin: 3500000,
    Paris: 2200000
}

let cityNewPopulations = {}
// console.log(Object.keys(cityPopulation));
// console.log(Object.values(cityPopulation));

for (const city in cityPopulation) {  
    // console.log(cityPopulation[city]);   // value
    // key = value
    // console.log(city);     // key
    if(city == "Berlin"){
        break
    }
    cityNewPopulations[city] = cityPopulation[city]
}
console.log(cityNewPopulations);

/*
(6) Use a `for-in` loop to loop through an object containing city populations.
Skip any city with a population below 3 million and store the rest in a new object named `largeCities`.

let worldCities = {
    "Sydney": 5000000,
    "Tokyo": 9000000,
    "Berlin": 3500000,
    "Paris": 2200000,
}
*/
let worldCities = {
    "Sydney": 5000000,
    "Tokyo": 9000000,
    "Berlin": 3500000,
    "Paris": 2200000,
}
let largeCities = {}

for(const city in worldCities){
    // console.log(city);    // key 
    // console.log(worldCities[city]);  // value
    if(worldCities[city] < 3000000){
        continue
    }
    largeCities[city] = worldCities[city]
}
console.log(largeCities);


// The forEach method executes a callback function once for each element in the array.
/*
(7) Write a `forEach` loop that iterates through the array `["earl gray", "green tea", "chai", "oolong tea"].
Stop the loop when "chai" is found, and store all previous tea types in an array named `availableTeas`.
*/
let teaCollection = ["earl gray", "green tea", "chai", "oolong tea"]
let availableTeas = []

teaCollection.forEach((tea)=>{
    // console.log(tea);
    if(tea === 'chai'){
        return;
    }
    availableTeas.push(tea)
});
console.log(availableTeas);

/* 
(8) Write a `forEach` loop that iterates through the array `["Berlin", "Tokyo", "Sydney","Paris"]`. Skip "Sydney" and store the other cities in a new array named `traveledCities`.
*/

let myWorldCities = ["Berlin", "Tokyo", "Sydney", "Paris"]
let traveledCities = []

myWorldCities.forEach(city=>{
    if(city === 'Sydney'){
        return
    }
    traveledCities.push(city)
})
console.log(traveledCities);

/*
(9) Write a `for` loop that iterates through the array `[2, 5, 7, 9]`.
Skip the value `7` and multiply the rest by 2. Store the results in a new array named `doubledNumbers`.
*/

let myNumbers = [2, 5, 7, 9]
let doubledNumbers = []
for(let i = 0; i < myNumbers.length; i++){
    // console.log(myNumbers[i]);
    if(myNumbers[i] === 7){
        continue
    }
    doubledNumbers.push(myNumbers[i] * 2) 
}

console.log(doubledNumbers);


/*
(10) Use a `for-of` loop to iterate through the array ["chai", "green tea", "black tea", "jasmine tea", "herbal tea"] and stop when the length of the current tea name is greater than 10. 
Store the teas iterated over in an array named `shortTeas`.
*/
let myTeas = ["chai", "green tea", "black tea", "jasmine tea", "herbal tea"]
let shortTeas = []

for(const tea of myTeas){
    // console.log(tea);
    // console.log(myTeas);
    if(tea.length > 10){
        break
    }
    shortTeas.push(tea)
}
console.log(shortTeas);


