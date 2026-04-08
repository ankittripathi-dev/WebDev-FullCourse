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
let array1: number[];
array1 = [11, 22];


// Example.2
let array2: number[] = [10, 20, 30];

// Example.3
let array3: string[] = ["ShaktiMaan", "SuperMan", "SpiderMan"];

// Example.4
let array4: boolean[]= [true, false, true]

// Example.5
let array5: object[] = [{name:"ankit"}, {role:"software Engineer"}]

// Example.6
let myArray1: Array<number> = [1, 2, 3];

// Example.7
let myArray2: Array<string> = ["sunny", "hunny", "bunny"];

// Example.8
let myArray3: Array<boolean> = [true, false , true]

// Example.9
let myArray4: Array<object> = [{name:"ankit", role:"software Engineer"}]


//! (5) Tuple
// Example.1
let arr3: [number, string, boolean];
arr3 = [7, "dell", true];

// Example.2
let arr4: [number, string] = [100, "ankit"];

// Example.3
let arr5: [number, object, boolean, string] = [1, {name:"mahi"}, true, "ankit"]


//! 6 Enum :- Enum (Enumeration) is used to define a set of named constants
// Example.1
enum role {
  Admin,
  User,
  Guest,
}

// Example.2
enum Status {
  Success,
  Error,
  Loading,
}

// Example.3   Numeric Enum
enum Role {
  Admin = 1,
  User = 2,
  Guest = 3,
}

// Example.4  String Enum (Most useful)
enum CurrentStatus {
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
//! (a) basic function :- TypeScript lets you define types for parameters and return value.
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
// TypeScript automatically detects return type so, here return type is boolean


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
 - Even though you didn’t write a return type, TypeScript automatically infers it.

👉 Since:
- a is number
- b is number
- a + b → result is number
 So TypeScript understands:

// Inferred by TypeScript
function add(a: number, b: number): number {
  return a+b // number
}
*/

//! (c) Default Parameters
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


//! (d) Optional Parameters
// Example.1
function greetUser(name: string, age?: number): string {
  return `Hello ${name}, Age: ${age ?? "Not provided"}`;
}
greetUser("Ankit");
// 👉 ? makes parameter optional


//! (e) Arrow Function
// Example.1
const addition = (a: number, b: number): number => {
  return a + b;
};


// Example.2
const myAddition = (a:object, b?:object): object =>{
  return a 
}
myAddition({name:"Uma"})



//! (9) Type Inference & Tpe Annotation

//! (a) Type Inference:- (Automatic) 👉 TypeScript automatically guesses the type
// Example.1
let name1 = "Ankit";  // Inferred as string
let age1 = 22;        // Inferred as number
// If You didn’t write types, then TS automatically understands them

// Example.2
function adding(a: number, b: number) {
  return a + b;   // inferred return type = number
}
// No need to write : number


//! (b) Type Annotation:- (Manual)  👉 You explicitly define the type
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

//!*****************************************************************************************************/
//! (10) Type Aliases:- Type Alias lets you create a custom name for any type (primitive, object, union, function, etc).
//! (a) Basic Syntax
type User = {
  name: string;
  age: number;
};
// Now You Can Reuse User Anywhere

const user1: User = {
  name: "Ankit",
  age: 22,
};


//! (b) Object Types
// Example.1
type Product = {
  id: number;
  title: string;
  price: number;
};

const item: Product = {
  id: 1,
  title: "Laptop",
  price: 50000,
};

// Example.2
type Post = {
  description: string;
  image?: string; // optional property
  likes: number;
};

let obj: Post = {
  description: "my first post",
  // image: "/image.png",
  likes: 10,
};


//! (c) Union Types
// Example.1
type ID = number | string;

let userId: ID;
userId = 101;
userId = "abc123";

// Example.2
type myName = number | string;

// let result: myName = 100;   
let result: myName = "Dhonee"


//! (d) Literal Types
type checkStatus = "sucess" | "error" | "pending";

let myResult: checkStatus = "sucess";


//! (e) Function Types
// Example.1
// Step 1: Create function type
type Add = (a: number, b: number) => number;

// Step 2: Use it
const sum: Add = (a, b) => a + b;

// Example.2
type MathFun = (a: number, b: number) => number;

const multiply: MathFun = (a, b) => {
  return a * b;
};


//! (f) Intersection Types:- Combine Multiple Types
// Example.1
type A = {
   name: string;
};

type B = {
   age: number
};

type AB = A & B;

const myObj: AB= {
  name: "Ankit",
  age: 22,
};

// *******************************************************************************************************
//! (11) InterFaces:- Interface is used to define the structure (shape) of an object.
// Example.1
interface UserDetails {
  name: string;
  age: number;
  email?: string;   // optional
  readonly apiKey: string;         
}

const userAnkit: UserDetails = {
  name: "Ankit",
  age: 26,
  apiKey: "123",
};

// !🔹 Readonly Properties
// Example.2
interface Config {
  readonly apiKey: string;
}

const config: Config = {
  apiKey: "123",
};

//! 🔹 Interface with Methods
// Example.3
interface Person {
  name: string;
  greet(): string;
}

const p: Person = {
  name: "Ankit",
  greet() {
    return "Hello";
  },
};


//! 🔹 Function in Interface
// Example.4
interface AddFunction {
  (a: number, b: number): number;
}

const MyAddition: AddFunction = (a, b) => a + b;


//! Using extends:- One interface inherits another
// Example.1
interface demoUser {
  name:string
}

interface test extends demoUser {
  age: number;
}


let finalResult: test = {
  name:"Ankit",
  age:26
}


// Example.2
interface PersonDetails {
  name:String;
  age:number;
}

interface AdminDetails extends PersonDetails {
  isOnline:boolean;
}


let adminDetails: AdminDetails = {
  name:"Ankit",
  age:26,
  isOnline: true
}


// Diffrence Between Type & Interface In TypeScripts
// Type
type UserDetail = {
  name: string;
};

// Interface
interface UserDetails {
  name: string;
}
