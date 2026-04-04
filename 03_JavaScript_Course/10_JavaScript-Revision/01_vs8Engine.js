/*
What is V8 Engine?
V8 is an open-source JavaScript engine developed by Google. It is written in C++

JS Code
 ↓
JS code is first parsed into a data structure called Abstract Syntax Tree (AST):
Parsing → AST (Abstract Syntax Tree)
 ↓
V8 uses an interpreter called Ignition to generate bytecode from the AST.
Ignition → Bytecode
 ↓
[Hot Code] → TurboFan → Optimized Machine Code

*/

// Earlir day there was any other way to executed js code othere then browser


/*
Made by: Google in 2008
First used in: Google Chrome
Written in: C++
*/


// Code Behind Js
// code goes to software => it's interpreter(line by line code)

// code file/ sorce code => paring

/*
   before the code Run
codefile => parsing => syntax tree
    
JIT compiler(intermediate) => Just in Time
byte code => 0, 1
machine code
code execution

*/
 

// Js code ->parsed into a data structure(called AST) Abstract Syntax Tree
// used an interpreter 
