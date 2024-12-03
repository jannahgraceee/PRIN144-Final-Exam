require('dotenv').config();
const { sql } = require('@vercel/postgres');
const express = require('express')
const app = express();
module.exports = app;
/*
const fs = require('fs')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml')
//terminal: npm i swagger-ui-express@4.6.2 yaml

const file  =  fs.readFileSync(process.cwd() + '/swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: CSS_URL,
}));
*/
// enable middleware to parse body of Content-type: application/json
app.use(express.json());

const PORT = 4000;

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

// const employees = [{ id: 1, firstName: 'Jannah', lastName: 'Claravall', position: 'Web Developer', department: 'IT', isWorkingFromHome: false}, { id: 2, firstName: 'Lovelie', lastName: 'Gaspar', position: 'Web Developer', department: 'IT', isWorkingFromHome: true},];
// let employeeID = employees.length;

// http://localhost:4000/employees
// app.get('/employees', (req, res) => {
//     if (req.query) {
//         if (req.query.id) {
//             // http://localhost:4000/employees?id=1
//             const employee = employees.find((employee) => employee.id === parseInt(req.query.id));
//             if (employee) {
//                 res.json(employee);
//             } else {
//                 res.status(404).json();
//             }
//             return;
//         }
//     }

//     res.json(employees);
// });

// // http://localhost:4000/employees/1
// app.get('/employees/:id', (req, res) => {
//     const id = req.params.id;
//     const employee = employees.find((employee) => employee.id === parseInt(id));

//     if (employee) {
//         res.json(employee);
//     } else {
//         res.status(404).json();
//     }
// });

// // http://localhost:4000/employees - { "name": "New employee" }
// app.post('/employees', (req, res) => {
//     employeeId++;
//     req.body.id = employeeID;
//     req.body.firstName = "";
//     req.body.lastName = "";
//     req.body.position = "";
//     req.body.department = "";
//     req.body.isWorkingFromHome = false;
//     employees.push(req.body);
//     res.status(201).json();
// });

// //http://localhost:4000/employees/1 - { "name": "employee 1 Updated", "isDone": true } | { "name": "employee 1 Updated" } | { "isDone": true }
// app.put('/employees/:id', (req, res) => {
//     const id = req.params.id;
//     const employee = employees.find((employee) => employee.id === parseInt(id));

//     if (employee) {
//         employee.id = parseInt(id);
//         employee.name = (req.body.name != undefined ? req.body.name : employee.name);
//         employee.isDone = (req.body.isDone != undefined ? req.body.isDone : employee.isDone);

//         res.json(employee);
//     } else {
//         res.status(404).json();
//     }
// });

// // http://localhost:4000/employees/1
// app.delete('/employees/:id', (req, res) => {
//     const id = req.params.id;
//     const employee = employees.find((employee) => employee.id === parseInt(id));

//     if (employee) {
//         employees.splice(employees.indexOf(employee), 1);
//         res.status(204).json();
//     } else {
//         res.status(404).json();
//     }
// });

// http://localhost:4000/employees
app.get('/employees', async (req, res) => {
    if (req.query) {
        if (req.query.id) {
            // http://localhost:4000/employees?id=1
            const employee = await sql`SELECT * FROM Employees WHERE Id =
   ${req.query.id};`;
            if (employee.rowCount > 0) {
                res.json(employee.rows[0]);
            } else {
                res.status(404).json();
            }
            return;
        }
    }
    const employees = await sql`SELECT * FROM Employees ORDER BY Id;`;
    res.json(employees.rows);
});


// http://localhost:4000/employees/1
app.get('/employees/:id', async (req, res) => {
    const id = req.params.id;
    const employee = await sql`SELECT * FROM Employees WHERE Id =
   ${id};`;
    if (employee.rowCount > 0) {
        res.json(employee.rows[0]);
    } else {
        res.status(404).json();
    }
});


//http://localhost:4000/employees - { "name": "New Task" }
app.post('/employees', async (req, res) => {
    await sql`INSERT INTO Employees (firstName, lastName, empPosition, Department, isWorkingFromHome) VALUES
   (${req.body.firstName, req.body.lastName, req.body.position, req.body.department, req.body.isWorkingFromHome});`;
    res.status(201).json();

    if (!firstName || !lastName || !empPosition || !department || isWorkingFromHome === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
      }
});
// app.post('/employees', async (req, res) => {
//     const { firstName, lastName, position, department, isWorkingFromHome } = req.body;
//     const result = await sql`
//         INSERT INTO Employees (firstName, lastName, empPosition, department, isWorkingFromHome) 
//         VALUES (${firstName}, ${lastName}, ${position}, ${department}, ${isWorkingFromHome || false})
//         RETURNING Id;
//     `;
//     res.status(201).json({ id: result.rows[0].id });
// });


//http://localhost:4000/employees/1 - { "name": "Task 1 Updated",
// "isWorkingFromHome" : true } | { "name": "Task 1 Updated" } | {
//     "isWorkingFromHome":true
// }

app.put('/employees/:id', async (req, res) => {
    const id = req.params.id;
    const employeeUpdate = await sql`UPDATE Employees SET firstName = ${(req.body.firstName != undefined ? req.body.firstName : employee.firstName)
        }, lastName = ${(req.body.lastName != undefined ? req.body.lastName : employee.lastName)
        }, empPosition = ${(req.body.position != undefined ? req.body.position : employee.position)
        }, Department = ${(req.body.department != undefined ? req.body.department : employee.department)
        }, isWorkingFromHome = ${(req.body.isWorkingFromHome != undefined ? req.body.isWorkingFromHome : employee.isWorkingFromHome)
        } WHERE Id = ${id};`;
    if (employeeUpdate.rowCount > 0) {
        const employee = await sql`SELECT * FROM Employees WHERE Id =
   ${id};`;
        res.status(200).json(employee.rows[0]);
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
});


// http://localhost:4000/employees/1
app.delete('/employees/:id', async (req, res) => {
    const id = req.params.id;
    const employee = await sql`DELETE FROM Employees WHERE Id = ${id};`;
    if (employee.rowCount > 0) {
        res.status(204).json();
    } else {
        res.status(404).json();
    }
});