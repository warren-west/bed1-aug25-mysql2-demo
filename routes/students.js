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

    console.log(sqlCommand)


    connection.query(sqlCommand, [`%${firstnameSearch}%`], (error, result, fields) => {
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