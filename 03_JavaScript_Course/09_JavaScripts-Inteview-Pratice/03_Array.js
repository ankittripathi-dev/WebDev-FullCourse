// (15) Write a JavaScript function to clone an array
function clone(arr){
    console.log([...arr]);
}
clone(['apple', 'mango', 'leechi'])

// method-2
function cloneArr(arr){
    let newArray = []
    arr.forEach((elem)=>{
        newArray.push(elem)
    })
    console.log(newArray);
}
cloneArr([1, 2, 3, 4])

// Method-3: Map always return new Array
function cloneArray(arr){
    let newArr =  arr.map((elem)=>{
        return elem
    })
    console.log(newArr);
}
cloneArray([1, 2, 3, 'Ankit'])
