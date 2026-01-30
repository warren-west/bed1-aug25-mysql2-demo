# Student Records Manager

Connecting an ExpressJS Server to a MySql Database, using:
- NodeJS
- [`express`](https://expressjs.com/)
- [`ejs`](https://ejs.co/)
- [`mysql2`](https://sidorares.github.io/node-mysql2/docs)
- [`dotenv`](https://www.npmjs.com/package/dotenv)

This project is a big step in our backend journey. We are moving away from using "in-memory" mock data, like a JavaScript array, or JSON files to serve mock data from within our project towards using a real database that stores our data safely, and enforces rules that we set up (think 1-1, 1-m, m-m relationships, and validators for fields in tables like `NOT NULL`, `PRIMARY KEY`, unique fields, `FOREIGN KEY`, `AUTO_INCREMENT`, etc.)

## Installation
Clone this repository to your machine with the command:
```bash
git clone https://github.com/warren-west/bed1-aug25-mysql2-demo.git
```

Install the necessary dependencies with the command:
```bash
npm install
```

## Environment Variables
This project uses 4 environment variables:
1. `PORT`: Which port the server should listen on.
2. `DATABASE`: The name of the database for MySql to connect to.
3. `HOST`: Where the database is located (for now we're only working with localhost).
4. `USER`: The username credential for connecting to MySql.
5. `PASSWORD`: The password credential for connecting to MySql.

Create a `.env` file in the root of your project folder, with the following contents:
```
PORT='3000'
DATABASE='universitydb'
HOST='localhost'
USER='root'
PASSWORD='admin'
```

> Environment variables are read from the `.env` file on project startup by the `dotenv` package we installed. The code that gets `dotenv` to grab the values from the `.env` file is:
> ```javascript
> require('dotenv').config()
> ```
> The code that fetches the value of a specific environment variable is:
> ```javascript
>// process.env.<variable name>, e.g.:
>process.env.PORT // returns '3000' in this case
>```

## "universitydb" Database
I've added a `/scripts` folder that contains the necessary SQL code to create the `universitydb` database, as well as the `students` table, and the data to populate the `students` table with. Copy and paste the SQL code into MySql Workbench and run it to have a fresh `universitydb` database to work with.

## Code Snippets
### 1. Using `dotenv` and a `.env` file
The installation instructions above require you to have a `.env` file in the root of your project with the following key-value pairs:
```
PORT='3000'
DATABASE='universitydb'
HOST='localhost'
USER='root'
PASSWORD='admin'
```
These are necessary **environment variables** for the project to run. They are read on startup, and if they change, your project needs to restart. We add the `.env` file to our `.gitignore` file so that these key-value pairs are treated as secret, and not available for the whole world to see. We use the `dotenv` NPM package to read the values of these variables, and use them within our project with the following code:
```javascript
// dotenv reads the .env file:
require('dotenv').config()
// ...
// access the values of the environment variables:
process.env.PORT
```

### 2. Setting up the Database Connection
We use the `mysql2` package to connect to our MySql Database, and interact with it via SQL commands.
Use `npm i mysql2` to install the [mysql2](https://www.npmjs.com/package/mysql2) package from NPM, and import it with Node's `require()` function to create a `mysql` object:
```javascript
const mysql = require('mysql2')
```

We can now use the `mysql` object to initialize a connection to the MySql database by providing the database name, where the database is hosted, and authentication credentials. All of these values we can grab from the `.env` file as environment variables:
```javascript
// set up the DB connection
const connection = mysql.createConnection({
    database: process.env.DATABASE,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
})
```
> If for some reason we wanted to connect to multiple databases in MySql, we would create multiple connections with the `mysql` object.

### 3. Read data from DB
We can use this `connection` object within the route endpoints of `/routes/students.js` to perform CRUD functionality on our database. To get all students from the database, we would use the SQL command:
```sql
SELECT * FROM students;
```
To execute this SQL on the `connection` object, we can use the `.query()` function, and access the results of the SQL in the callback function:
```javascript
// inside /routes/students.js
// GET / endpoint
connection.query('SELECT * FROM students;', (error, result) => {
    // print the array of all the student objects received from the DB
    console.log(result)
})
```
Extend the code with some error handling:
```javascript
connection.query('SELECT * FROM students;', (error, result) => {
    if (!error) {
        // if error is null, print the result
        console.log(result)
    }

    // log the error object if it's not null
    console.error(error)
})
```

### 4. Advanced read from DB
The current SELECT statement is very boring though. How about we try and customize the SQL SELECT statement to possibly filter the student list, or to order it? Think to how we would achieve that by SQL:
```sql
-- Using a partial match filter:
SELECT * FROM students WHERE firstname LIKE '%Jon%' ORDER BY firstname;
-- returns any students whose firstname includes "Jon", like "Jon" or "Jonathan"

-- Using an exact match filter:
SELECT * FROM students WHERE firstname = 'Jon' ORDER BY firstname;
-- only returns students whose names are "Jon". This excludes "Jonathan"
```

We can get the "filter" text and the "order by" text from the URL in our endpoint. Remember we can can manipulate the URL query string to include non-sensitive data like this:
```
http:localhost:3000/students?firstname=Jon&order=desc
```
To grab these values from the URL in our JavaScript code we can use the following syntax:
```javascript
// GET /
router.get('/', (req, res) => {
    // get values from the URL query string
    const filterText = req.query.firstname
    const orderText = req.query.order
})
```

From this point it's a regular old coding challenge to use those values to produce the exact SQL query we want. Once we've generated our SQL text, we need to use **[prepared statements](https://sidorares.github.io/node-mysql2/docs#using-prepared-statements)** to add parameters into our SQL command with the `?` placeholder syntax. For example, if we want to find students whose `firstname` = `Jon`, we will construct a SQL statement like this:
```
SELECT * FROM student WHERE firstname = ?;
```
Now we need to tell the `connection` object that when we call the `.query()` function with a SQL command that has `?` placeholders in it, they should be substituted with variable values:
```javascript
// GET /
router.get('/', (req, res) => {
    // get values from the URL query string
    const filterText = req.query.firstname
    const orderText = req.query.order
    let sqlCommand = 'SELECT * FROM students WHERE firstname = ? ORDER BY firstname'
    // ...logic to build the SQL command...
    // call the .query() function and provide an ARRAY as a second parameter
    // every element in the array will be matched to a '?' in the SQL command
    connection.query(sqlCommand, [filterText], (error, result) => {
        // handle the results of the SQL command
    })
})
```

### 5. Add new student to DB
We can use the exact same logic as in the previous section to add a new student into our database, by constructing an appropriate SQL command, and executing it on the database through the `connection.query()` function. You can imagine the SQL command would look like this:
```sql
INSERT INTO students (firstname, lastname) VALUES ('Jon', 'Snow');
```
And you can probably imagine that the query text in our JavaScript would have to use a prepared statement, adding variable data into the command like this:
```javascript
const sqlCommand = "INSERT INTO students (firstname, lastname) VALUES (?, ?);"
```
> Each `?` represents a variable that should be replaced with a SQL parameter.

Let's create a new `POST` endpoint, that handles adding a new students into the database. It should have a place for us to execute the above command on our `connection` object. It'll look like this:
```javascript
// POST /
router.post('/', (req, res) => {
    // we can get the values for "firstname" and "lastname" from the body of the request
    // we have done this before:
    const firstname = req.body.firstname
    const lastname = req.body.lastname

    // perform some validation to make sure neither are empty
    if (!firstname || !lastname) {
        // handle the error...
    }

    // setup the command and execute the query
    const sqlCommand = "INSERT INTO students (firstname, lastname) VALUES (?, ?);"
    connection.query(sqlCommand, [ firstname, lastname ], (error, result) => {
        if (!error) {
            // If the error is not null, handle the success
            console.log("Success")
            console.log(result)
        } else {
            // else handle the error
            console.log("Error")
            console.log(error)
        }
    })
})
```

### 6. Deleting records from the DB
We can delete a record from a table in the database with the following SQL code:
```sql
DELETE FROM students WHERE studentId = 1;
```
It's always a good idea to delete one record at a time, using the primary key field. There are instances where we can do batch-deletes, but remember what Uncle Ben always said: *"With great power comes great responsibility."*

We can create a new endpoint in our `/routes/students.js` to handle deletions. For now, because we haven't officially learnt how to use a tool like `Axios` to send HTTP requests other than `GET` and `POST`, we are limited to creating endpoints that only receive `GET`s and `POST`s. So I've created a `POST` handler that will intercept `POST` requests to the URL `/students/:id/delete`. In the future we'll have a proper `DELETE` handler (`router.delete('/', (req, res) => {...})`). It's usually considered bad practice to have words like *add*, *delete*, *update*, *fetch*, etc. in our URLS.
```javascript
// POST /:id/delete
router.post('/:id/delete', (req, res) => {
    // get the ID of the student to delete from the URL
    const studentId = req.params.id

    // perform the deletion
    connection.query("DELETE FROM students WHERE studentId = ?;", [studentId], (error, result) => {
        if (!error) {
            // handle the success
        } else {
            // handle the error
        }
    })
})
```

We can check how many rows were affected by the command, by logging out the `result` object. It has a property on it called `affectedRows`, with the number of affected rows. So we can determine that the execution was successful if 1 row was affected. The result object looks like this:
```javascript
ResultSetHeader {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 0,
  info: '',
  serverStatus: 2,
  warningStatus: 0,
  changedRows: 0
}
```
If `0` rows were affected no records were deleted. Perhaps because an invalid ID was provided. The result object looks like this:
```javascript
ResultSetHeader {
  fieldCount: 0,
  affectedRows: 0,
  insertId: 0,
  info: '',
  serverStatus: 2,
  warningStatus: 0,
  changedRows: 0
}
```