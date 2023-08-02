const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = require('./db/connection');
const express = require('express');


const Router = express.Router();

db.connect(async function(){
    promptMenu()
} );

//Prompt user to make a selection:
function promptMenu(){
    inquirer.prompt([
    {
        type: 'list',
        name: 'choice',
        message: 'Please choose from the following menu:',
        choices: [
            'View all departments', 
            'View all positions', 
            'View all employees',  
            'View managers',
            'Update employee position',
            'Add department',
            'Add position',
            'Add employee'
        ]
    }
    ]).then((answers) =>{
        const choices = answers.choice;
        if (choices === 'View all departments'){
            viewAllDep();
        }if (choices === 'View managers'){
            viewManagers();
        }if (choices === 'View all positions'){
            viewAllPositions();
        }if (choices === 'View all employees'){
            viewAllEmployees();
        }if (choices === 'Update employee position'){
            updateEmployeePosition();
        }if (choices === 'Add department'){
            addDepartment();
        }if (choices === 'Add position'){
            addPosition();
        }if (choices === 'Add employee'){
            addEmployee();
        }
    });
};


function viewAllDep(){
    let sql = "SELECT * FROM departments";
    db.query(sql, (err, res)=>{
        if (err) throw err;
        console.log('All Departments:')
        console.table(res);
        return promptMenu();
    })
};

function viewManagers(){
    let sql = "SELECT * FROM managers";
    db.query(sql, (err, res)=>{
        if (err) throw err;
        console.log('Managers:')
        console.table(res);
        return promptMenu();
    })
};
function viewAllPositions (){
    const sql = "SELECT position_id, title, salary, department_name AS department FROM positions LEFT JOIN departments ON positions.department_id = departments.department_id"; 
    db.query(sql, (err, res) =>{
        if(err) throw err;
        console.log('All positions:');
        console.log('All positions:');
        console.table(res);
         return promptMenu();
    });
};

function viewAllEmployees (){
    const sql = "SELECT employees.employee_id, employees.first_name, employees.last_name, positions.title AS title, managers.name AS manager FROM employees LEFT JOIN positions ON employees.position_id = positions.position_id LEFT JOIN managers ON employees.manager_id = managers.manager_id";
    db.query(sql, (err, res)=>{
        if(err) throw err;
        console.log('All employees:');
        console.table(res);
        return promptMenu();
    });
};

function updateEmployeePosition(){
 const sql = "SELECT first_name, last_name, employee_id from employees";
 db.query(sql, (err, res)=>{
    if (err) throw err;

    //const employees = res.map(({first_name, last_name, employee_id})=>({key: `${first_name} ${last_name}`, value: `${employee_id}`}));
    const employees = res.map(({first_name, last_name, employee_id})=>({key: `${first_name} ${last_name}`, value: `${employee_id}`}));

    inquirer.prompt([
        {
            type: "list", 
            name: "employee", 
            message: "Please select an employee to update their position.",
            choices: employees
        }
    ]).then((answers) =>{
        const employee = answers.employee;
        const params=[employee];
        const sql = "SELECT title, position_id FROM positions";
        db.query(sql, (err, res)=>{
            if (err) throw err;
            const positions = res.map(({title, position_id})=>({key: title, value: position_id }));

            inquirer.prompt([
                {
                    type: "list", 
                    name: "position", 
                    message: "what is the new position of this employee?",
                    choices: positions
                }
            ]).then ((answers)=>{
                const position = answers.position;
                params.unshift(position);
                const sql = 'UPDATE employees SET position_id = ? WHERE position_id = ?'
            db.query(sql, params, (err)=>{
                if(err){
                    throw err;
                }
                console.log('Position updated');
                return promptMenu();
            })
            })
        })
    });
 })
};

function addDepartment(){
    inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter department you would like to add:',
            name: 'NewDepartment',
            validate: departmentValue =>{
                if(departmentValue){
                    return true;
                } else {
                    console.log("Please enter department name");
                    return false;
                };
            }
        }     
    ]).then((answers)=>{
        const newDep = answers.NewDepartment;
        const sql = "INSERT INTO departments(department_name) VALUES(?)";
        db.query(sql, newDep, (err)=>{
            if(err)throw err;
            console.log("Department added!");
            return promptMenu();
        });
    })
};

function addPosition(){
    return inquirer.prompt([
        {
            type: 'input',
            name: 'title', 
            message: "Please enter position you would like to add:",
            validate: positionValue =>{
                if(positionValue){
                    return true;
                } else {
                    console.log("Please enter position name");
                    return false;
                };
            }
        },
        {
            type: 'input',
            name: 'salary', 
            message: "Please enter salary for this position:",
            validate: salaryValue =>{
                if(salaryValue){
                    return true;
                } else {
                    console.log("Please enter salary");
                    return false;
                };
            }
        }
    ]).then((answers)=>{
        const params= [answers.title, answers.salary];
        const sql ="SELECT * FROM departments";
        db.query(sql, (err, res)=>{
            if(err) throw err;
            const departments = res.map(({department_name, department_id})=>({key: department_name, value: department_id}));
            inquirer.prompt([
                {
                    type: "list", 
                    name: "departments",
                    message: "Select department for this position:",
                    choices: departments
                } 
            ]).then((answers)=>{
                const departments = answers.departments;
                params.push(departments);
                const sql = "INSERT INTO positions (title, salary, department_id) VALUES (?, ?, ?)";
            db.query(sql, params, (err)=>{
                if(err) throw err;
                console.log("Position added!");
                return promptMenu();
            })
            })
        })
    })
};

function addEmployee(){
    inquirer.prompt([
        {
            type: 'input',
            name:'firstName',
            message: "Please enter employee's first name",
            validate: fnameValue =>{
                if (fnameValue){
                    return true;
                }else {
                    console.log("Please ente employee's first name");
                    return false;
                }
            }
        },
        {
            type: 'input',
            name:'lastName',
            message: "Please enter employee's last name",
            validate: lnameValue =>{
                if (lnameValue){
                    return true;
                }else {
                    console.log("Please ente employee's last name");
                    return false;
                }
            }
        }
    ]).then ((answers)=>{
        const params = [answers.firstName, answers.lastName];
        const sql ="SELECT * FROM positions";
        db.query(sql, (err, res)=>{
            if (err) throw err;
            const position = res.map(({title, position_id})=>({key: title, value: position_id}));
        inquirer.prompt([
            {
            type: "list",
            name: "position", 
            message: "Please select the position for this employee",
            choices: position
            }
        ]).then((answers)=>{
            const position = answers.position;
            params.push(position);
            const sql = "SELECT * FROM employees";
            db.query(sql, (err, res)=>{
                if (err) throw err;
                const managers = res.map(({first_name, last_name, employee_id})=>({key: `${first_name} ${last_name}`, value: employee_id}));
                inquirer.prompt([
                    {
                        type:'list', 
                        name: 'manager', 
                        message: 'Please select manager for this employee', 
                        choices: managers
                    }
                ]).then((answers)=>{
                    const manager = answers.manager;
                    params.push(manager);
                    const sql = "INSERT INTO employees (first_name, last_name, position_id, manager_id) VALUES(?, ?, ?, ?)";
                    db.query(sql, params, (err)=>{
                        if (err) throw err;
                        console.log ("Employee added!");
                        return promptMenu();
                    });
                });
            });
        });
        });
    });
};