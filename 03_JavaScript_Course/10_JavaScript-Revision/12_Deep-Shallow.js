/*
🔹 Shallow Copy
- A shallow copy creates a new object/array, but nested objects/arrays are still referenced (same memory address).
- Changes in nested objects reflect in both copies.

let user = {
  name: "Ankit",
  address: {
    city: "Gurugram",
    pin: 122001
  }
};

// Shallow copy using spread operator
let shallowCopy = { ...user };

shallowCopy.name = "Tripathi";   // ✅ only changes in shallowCopy
shallowCopy.address.city = "Delhi"; // ⚠ changes in both

console.log(user.name);      // "Ankit"
console.log(user.address.city); // "Delhi" ❌ (changed)


➡️ Here, address is still linked (same reference), so modifying it in the copy affects the original.
*/

let user = {
    name: 'Ankit',
    address:{
        city:'gurugram',
        pin:122001
    }
}
let shallowCopy = {...user}

shallowCopy.name = 'Aryan'
shallowCopy.address.city = 'delhi'

console.log(user);
console.log(shallowCopy);


/*
🔹 Deep Copy
- A deep copy creates a completely independent copy.
- No shared references, even nested objects/arrays are cloned.
- Example (using structuredClone in JS):

✅ Summary
Shallow copy: Top-level copy only, nested references are shared.
Deep copy: Full independent clone, no shared references.
*/

let person = {
  company: "codeSoft",
  address: {
    city: "Gurugram",
    pin: 122001
  }
};

// Deep copy
// let deepCopy = structuredClone(person)

deepCopy.company = "prodigy";
deepCopy.address.city = "Delhi";

console.log(person.company);        
console.log(person.address.city);

console.log(person);
console.log(deepCopy);


