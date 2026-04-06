//! (1) Number
// Example.1
let num1: number;
num1 = 10;

// Example.2
let num2: number = 200;


//! (2) String
// Example.1
let str1: string;
str1 = "ankit";

// Example.2
let str2: string = "hello dosto";


//! (3) boolean
// Example.1
let isOnline: boolean;
isOnline = true;

// Example.2
let isAdult: boolean = true;

//! (4) Array
// Example.1
let arr1: number[];
arr1 = [11, 22];

// Example.2
let arr2: number[] = [10, 20, 30];

// Example.3
let realHeros: string[] = ["ShaktiMaan", "SuperMan", "SpiderMan"];

// Example.4
let playerName: Array<string> = ["Raina", "Watson", "Bravo"];

// Example.5
let isLogIn: Array<boolean> = [true, false, true];


//! (5) Tuple
// Example.1
let arr3: [number, string, boolean];
arr3 = [7, "dell", true];

// Example.2
let arr4: [number, string] = [100, "ankit"];

//! 6 Enum :- Enum (Enumeration) is used to define a set of named constants
// Example.1
enum role {
  Admin,
  User,
  Guest
}

let currentRole = role.Admin;

// Example.2
enum Status {
  Success,
  Error,
  Loading,
}

let currentStatus = Status.Success;

// Example.3  🔢 Numeric Enum
enum Role {
  Admin = 1,
  User = 2,
  Guest = 3,
}

// Example.4  🔤 String Enum (Most Useful)
enum Status {
  SUCCESS = "success",
  ERROR = "error",
  LOADING = "loading",
}



//! (7) Any
// Example.1
let c: any;

c = 78;
c = "ankit";
c = false;
c = ["ankit"];

// Example.2
let some: any = ["ram", 12, false, ["urvil", "ayush", "mahi"]];


//! (8 Function in TypeScript
// (a) basic function :- TypeScript lets you define types for parameters and return value
// Example.1
function greet(name: string): string {
  return `Hello, ${name}`;
}
greet("Ankit");
// name: string → parameter type
// : string → return type

// Example.2
function hello(name: string, age: number): string {
  return `Hello ${name} here, I am ${age} year old`;
}
hello("ankit", 26);
// name: string --> parameter type
// age:number --> parameter type
// : string --> return type

//! (b) Function Without Return (void) :- void means nothing
// Example.1
function logMessage(msg: string): void {
  console.log(msg);
}
logMessage("hello");
// void means the function does not return anything

// Example.2
function ayush(a: number, b: string) {
  return false;
}
// return type is boolean

// Example.3
function add(a: number, b: number) {
  return a + b;
}
// ✅ TypeScript automatically detects return type So, here return type is number

/*
✅ Your Code
function add(a: number, b: number) {
  return a + b;
}
🧠 What TypeScript is Doing Here

Even though you didn’t write a return type, TypeScript automatically infers it.

👉 Since:

a is number
b is number
a + b → result is number

✔ So TypeScript understands:

// Inferred by TypeScript
function add(a: number, b: number): number
*/

//! 🎯 (3) Default Parameters
// Example.1
function greetDefault(name: string = "Guest"): string {
  return `Hello ${name}`;
}
greetDefault(); // Hello Guest

// Example.2
function sayHello(a: number, b: string = "moon"): number {
  return 55;
}
sayHello(10); 


//! 🎯 4. Optional Parameters
// Example.1
function greetUser(name: string, age?: number): string {
  return `Hello ${name}, Age: ${age ?? "Not provided"}`;
}
greetUser("Ankit"); // ✅
// 👉 ? makes parameter optional


//! 🔥 5. Arrow Function
const addition = (a:number, b:number): number => {
  return a+b
}


//! (9) Type Inference & Tpe Annotation

//! (1) Type Inference:- (Automatic) 👉 TypeScript automatically guesses the type
// Example.1
let name1 = "Ankit";   // Inferred as string
let age1 = 22;         // Inferred as number

// You didn’t write types, but TS understands them

// Example.2
function adding(a: number, b: number) {
  return a + b; // inferred return type = number
}
// No need to write : number


//! (2) Type Annotation:- (Manual  👉 You explicitly define the type
// Example.1
let name2: string = "Ankit";
let age2: number = 22;

// Example.2
function addNum(a: number, b: number): number {
  return a + b;
}


/* 🎯 Interview Answer (Perfect)
- Type inference is when TypeScript automatically determines a type.
- Type annotation is when we explicitly define it.
- Type declaration is used to create custom reusable types using type or interface.
*/

//!****************************************************************************************************************/
//! Type Aliases:- Type Alias lets you create a custom name for a type

// 🧩 Type Alias with Union Types
// Example1
type myName = number | string  

// let result: myName = 1010
let result:myName;
result = 100;
result = "Ankit"


// Example.2
type ID = number | string;

let userId: ID = 101;
userId = "abc123";

// Example.3
type status = "sucess" | "error" | "pending"

let store:status
store = "error"


// 🔥 Basic Example
type User = {
  name: string;
  age: number;
};
// Now you can reuse User anywhere

const user1: User = {
  name: "Ankit",
  age: 22,
};




