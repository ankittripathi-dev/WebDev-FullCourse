


    //***** (1) Function Declaration (Hoisted / Normal Function)  ***********/
    // Example.1
    function sayHello() {
        console.log('Hello, namaste');
    }
    sayHello()

    // Example.2
    function hello(name) {  // parameters
        return `Hello ${name}`
    }
    console.log(hello('Ankit'));  // arguments


        //**** (2) Using Arrow function ******//
        // Example.1
        const greet = () => {
            console.log('good moring');
        }
        greet()

        // Example.2
        const fruits = (name) => {
            console.log(name);
        }
        fruits('Apple')


        //**** (3) Function Expression ********//
        // Example.1
        const greets = function (name) {
            return `Hello, ${name}`;
        };
        console.log(greets("Chandu")); // Hello, Chandu


        // Example.2
        const tech = function () {
            console.log('React js');
        }
        tech()


        // Hoisting :- JavaScript moves declarations (not assignments) to the top of their scope (global or function) before code execution. 

        // 👉 During the memory creation phase (before code runs), JavaScript moves function declarations and variable declarations (var) to the top of their scope (global scope or function scope).
        // But ⚠️ only the declarations are hoisted, not the assignments (except function declarations, which are hoisted with their body).

        sayHello(); // ✅ Works (hoisted)

        function sayHello() {
            console.log("Hello, I am hoisted!");
        }

        // Example Using Function
        Company()  // function decleration is hoisted to th top of their code
        function Company() {
            console.log('Samsung');
        }
        Company()

        // Example 
        console.log(a);   // undefined
        var a = 10


