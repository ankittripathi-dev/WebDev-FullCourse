// (2) Find the largest number in an array.
// Approach-1
let array = [1, 44, 55, 201, 91]

let result = Math.max(...array)
console.log(result);  // output:- 201


// Approach-2
let arr = [10, 2, 8, 7, 99, 1, 71]

let largest = arr.reduce((accumulatorVal, currentVal)=>{
    return currentVal > accumulatorVal ? currentVal: accumulatorVal
},0)
console.log(largest);  // output:99


/*
Step 1: Initialization
The array is: [10, 2, 8, 7, 99, 1, 71]
We gave initial value = 0 (explicitly in reduce).
So before starting iteration:
🔹 accumulatorVal = 0,  currentVal = 10 (first element of array).

Iteration by Iteration
1️⃣ First iteration
🔹 accumulatorVal = 0, currentVal = 10

Condition: 10 > 0 ? → true
Return → 10
New accumulatorVal = 10


2️⃣ Second iteration
🔹 accumulatorVal = 10, currentVal = 2

Condition: 2 > 10 ? → false
Return → 10
New accumulatorVal = 10


3️⃣ Third iteration
🔹 accumulatorVal = 10, currentVal = 8

Condition: 8 > 10 ? → false
Return → 10
New accumulatorVal = 10


4️⃣ Fourth iteration
🔹 accumulatorVal = 10, currentVal = 7

Condition: 7 > 10 ? → false
Return → 10
New accumulatorVal = 10


5️⃣ Fifth iteration
🔹 accumulatorVal = 10, currentVal = 99

Condition: 99 > 10 ? → true
Return → 99
New accumulatorVal = 99


6️⃣ Sixth iteration
🔹 accumulatorVal = 99, currentVal = 1

Condition: 1 > 99 ? → false
Return → 99
New accumulatorVal = 99


7️⃣ Seventh iteratio
🔹 accumulatorVal = 99, currentVal = 71

Condition: 71 > 99 ? → false
Return → 99
New accumulatorVal = 99

🔵 Final Result
End of array → reduce returns 99.

🔵 largestNumber = 99
*/