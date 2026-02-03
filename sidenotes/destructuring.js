// Destructure the req.body object
// In JavaScript we can DESTRUCTURE Objects and Arrays with {} or [] syntax
// For example:
const numberNames = ['One', 'Two', 'Three'] // AN ARRAY
const person = { fname: "Warren", lname: "West", age: 33 } // AN OBJECT

let [a, b, c] = numberNames
let { age, fname, lname } = person

console.log(a, b, c)            // Output?
console.log(age, fname, lname)  // Output?

// Get the 'firstname' and 'lastname' from the request body
const { firstname, lastname } = req.body