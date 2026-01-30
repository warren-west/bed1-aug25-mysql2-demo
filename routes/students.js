// this line of code reads the .env file, and will give you access to process.env.<environment variable name>
require('dotenv').config()
const router = require('express').Router()
const mysql = require('mysql2')

// set up the DB connection
const connection = mysql.createConnection({
    database: process.env.DATABASE,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
})

// GET /students
router.get('/', (req, res) => {
    // Basic functionality -> Get all students
    let sqlCommand = 'SELECT * FROM students' // base SQL SELECT

    // Filter -> Students by firstname / lastname with a search query
    const firstnameSearch = req.query.firstname
    let sortOrder = req.query.order

    // a filter argument exists
    if (firstnameSearch)
        sqlCommand += ` WHERE firstname LIKE ?`

    // Sort -> Sort list of students ASC / DESC
    sortOrder = normalizeSortOrderString(sortOrder)
    if (sortOrder)
        sqlCommand += ` ORDER BY firstname ` + sortOrder

    connection.query(sqlCommand, [`%${firstnameSearch}%`], (error, result) => {
        if (!error) {
            // everything was successful:
            res.render('students', { studentList: result })
            return
        } else {
            // something went wrong:
            res.render('error', { error })
            return
        }
    })
})

// GET /students/new
router.get('/new', (req, res) => {
    res.render('addStudent', {})
})

// POST /students
// Add a new student to the database
router.post('/', (req, res) => {
    // Get the 'firstname' and 'lastname' from the request body
    const firstname = req.body.firstname
    const lastname = req.body.lastname

    // validate the data from the request body
    // in the DB, we set "firstname" and "lastname" columns to NOT NULL
    if (!firstname || !lastname) {
        // the firstname or lastname is missing from the request body
        res.render('error', { error: "There needs to be a valid firstname and lastname." })
        return
    }

    // INSERT INTO students (firstname, lastname) VALUES ('John', 'Smith');
    const sqlCommand = `INSERT INTO students (firstname, lastname) VALUES (?, ?);`

    // execute the sql on the mysql connection
    connection.query(sqlCommand, [firstname, lastname], (err, result) => {
        if (!err) {
            console.log(result)
            // success - redirect to the student list page
            res.redirect('/students')
            return
        } else {
            // error
            res.render('error', { error: err })
            return
        }
    })
})

// POST /students/id/delete
// LOGIC:
// 1. check if a student with the provided ID exists
// 2. if the student does not exist, render the error page
// 3. if the student does exist, try delete them from the database
// setup a SQL command to delete the student
// 4. if something goes wrong while trying to delete them, render the error page
// 5. else if it's successful, redirect to the /students student list page
router.post('/:id/delete', (req, res) => {
    // get the ID of the student to be deleted from the URL
    const studentId = req.params.id

    // try delete the student from the database
    connection.query('DELETE FROM students WHERE studentId = ?;', [studentId], (err, result) => {
        if (!err) {
            console.log(result)
            // handle success; redirect to the student list page
            res.redirect('/students')
            return
        } else {
            // something went wrong
            res.render('error', { error: err.message })
            return
        }
    })
})

// Return 'asc', 'desc' or null
function normalizeSortOrderString(input) {
    if (!input)
        return null

    input = input.toLowerCase()
    // if input is not a valid 'asc' / 'desc' return null 
    if (input !== 'asc' && input !== 'desc') // could be undefined or "adfgsrthhyr"
        return null

    return input
}

module.exports = router