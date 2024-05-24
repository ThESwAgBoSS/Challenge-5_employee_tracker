const inquirer = require('inquirer');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { table } = require('table');

const db = new sqlite3.Database('./company.db');

// Schema and seeds
const schemaPath = path.resolve(__dirname, 'db/schema.sql');
const seedsPath = path.resolve(__dirname, 'db/seeds.sql');

const initializeDb = () => {
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    const seeds = fs.readFileSync(seedsPath, 'utf-8');

    db.exec(schema, (err) => {
        if (err) {
            console.error('Error creating schema:', err.message);
            return;
        }
        db.exec(seeds, (err) => {
            if (err) {
                console.error('Error inserting seeds:', err.message);
                return;
            }
            console.log('Database initialized successfully');
        });
    });
};

// Initialize the database (uncomment the next line if you need to initialize/reset the database)
// initializeDb();

const viewAllDepartments = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM department', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const viewAllRoles = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT role.id, role.title, department.name AS department, role.salary
            FROM role
            JOIN department ON role.department_id = department.id
        `;
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const viewAllEmployees = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, 
                   m.first_name || ' ' || m.last_name AS manager
            FROM employee e
            JOIN role r ON e.role_id = r.id
            JOIN department d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
        `;
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const addDepartment = (name) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO department (name) VALUES (?)';
        db.run(query, [name], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
    });
};

const addRole = (title, salary, departmentId) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        db.run(query, [title, salary, departmentId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
    });
};

const addEmployee = (firstName, lastName, roleId, managerId) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
        db.run(query, [firstName, lastName, roleId, managerId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
    });
};

const updateEmployeeRole = (employeeId, newRoleId) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
        db.run(query, [newRoleId, employeeId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ changes: this.changes });
            }
        });
    });
};

const actions = {
    'View all departments': async () => {
        const departments = await viewAllDepartments();
        console.log(table(departments.map(dept => [dept.id, dept.name])));
    },
    'View all roles': async () => {
        const roles = await viewAllRoles();
        console.log(table(roles.map(role => [role.id, role.title, role.department, role.salary])));
    },
    'View all employees': async () => {
        const employees = await viewAllEmployees();
        console.log(table(employees.map(emp => [emp.id, emp.first_name, emp.last_name, emp.title, emp.department, emp.salary, emp.manager])));
    },
    'Add a department': async () => {
        const { name } = await inquirer.prompt([
            { type: 'input', name: 'name', message: 'Enter the name of the department:' }
        ]);
        await addDepartment(name);
        console.log('Department added successfully.');
    },
    'Add a role': async () => {
        const { title, salary, departmentId } = await inquirer.prompt([
            { type: 'input', name: 'title', message: 'Enter the title of the role:' },
            { type: 'input', name: 'salary', message: 'Enter the salary for the role:' },
            { type: 'input', name: 'departmentId', message: 'Enter the department ID for the role:' }
        ]);
        await addRole(title, salary, departmentId);
        console.log('Role added successfully.');
    },
    'Add an employee': async () => {
        const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
            { type: 'input', name: 'firstName', message: 'Enter the first name of the employee:' },
            { type: 'input', name: 'lastName', message: 'Enter the last name of the employee:' },
            { type: 'input', name: 'roleId', message: 'Enter the role ID for the employee:' },
            { type: 'input', name: 'managerId', message: 'Enter the manager ID for the employee (leave blank if none):', default: null }
        ]);
        await addEmployee(firstName, lastName, roleId, managerId);
        console.log('Employee added successfully.');
    },
    'Update an employee role': async () => {
        const { employeeId, newRoleId } = await inquirer.prompt([
            { type: 'input', name: 'employeeId', message: 'Enter the employee ID to update:' },
            { type: 'input', name: 'newRoleId', message: 'Enter the new role ID:' }
        ]);
        await updateEmployeeRole(employeeId, newRoleId);
        console.log('Employee role updated successfully.');
    },
    'Exit': () => {
        process.exit();
    }
};

const main = async () => {
    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: Object.keys(actions)
            }
        ]);

        await actions[action]();
    }
};

main();