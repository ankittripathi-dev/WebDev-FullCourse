# 1 Number 
- let age: number = 25;

# (2) String
- let name: string = "Ankit"

# (3) Boolean
- let isOnline: boolean = true

# (4) Array
-  let scores: number[] = [10, 20, 30, 40]

# (5) Tuple
- let user: [string, number, boolean] = ["ankit", 7, true]

# (6) Enum
- enum Role {Admin, User, Guest}

# (7) Any
- let something: any = "can be anithing"

# (8) void
- function log(); void {
    console.log("Hello);
}



## 🔥 Difference (Simple Table)
| Concept          | Meaning         | Example              |
| ---------------- | --------------- | -------------------- |
| Type Inference   | TS guesses type | `let x = 10`         |
| Type Annotation  | You define type | `let x: number = 10` |
| Type Declaration | Custom types    | `type User = {...}`  |
