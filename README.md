# Employee-Tracker

## Description

This app allows the user create, view, and manage a company employee database.

---

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Code Snippets](#code-snippets)
* [Technology](#technology)
* [Credits](#credits)
* [Testing](#testing)
* [License](#license)

---

## Installation

The files for this program can be downloaded [here](https://github.com/pdbesse/Employee-Tracker/archive/refs/heads/main.zip). 

This app requires node.js to be installed. For download and installation instructions, please see [nodejs.org](https://nodejs.org/en/download/).

This app also requires Inquirer and mySQL2 to be installed. To do this, open the terminal and navigate to the extracted folder. Enter: 
```
npm install
```
This will download any modules required for the app to work. Still in the console, enter:
```
npm start
```
This will launch the program.

A video walkthrough of the app can be viewed [here](https://www.youtube.com/watch?v=7SKkxWPGjJw).

---

## Usage

![usage-gif](./assets/usage-gif.gif)



---

## Code Snippets

Because there was a lot of code for this project, I will highlight three particular functions I'm proud of.
```javascript
const addEmp = () => {
    inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: "What is your new employee's first name?"
        },
        {
            name: 'last_name',
            type: 'input',
            message: "What is your new employee's last name?"
        },
        {
            name: 'title',
            type: 'rawlist',
            message: "What is your new employee's title?",
            choices: roleArr
        },
        {
            name: 'manager_name',
            type: 'rawlist',
            message: "Who is your new employee's manager?",
            choices: empArr
        }
    ])
        .then((response) => {
            let manID;
            connection.query(`SELECT * FROM employees`, (err, employees) => {
                if (err) {
                    console.error(err);
                }
                for (i = 0; i < employees.length; i++) {
                    if (response.manager_name.includes(employees[i].last_name)) {
                        manID = employees[i].id;
                    }
                }

                let roleID;
                connection.query(`SELECT * FROM roles`, (err, roles) => {
                    if (err) {
                        console.error(err);
                    }
                    for (i = 0; i < roles.length; i++) {
                        if (response.title === roles[i].title) {
                            roleID = roles[i].id;
                        }
                    }
                    connection.query(`INSERT INTO employees SET ?`, { first_name: response.first_name, last_name: response.last_name, role_id: roleID, manager_id: manID }, (err, res) => {
                        if (err) {
                            console.error(err);
                        } else {
                            connection.query(`SELECT * from employees`, (err, res) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    console.table(res);
                                    console.log(`New employee added.`)
                                }
                            });
                        };
                        start();
                    });
                })
            })
        });

}
```

This is a look at the entire addEmp(). I will break it down below.

```javascript
    inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: "What is your new employee's first name?"
        },
        {
            name: 'last_name',
            type: 'input',
            message: "What is your new employee's last name?"
        },
        {
            name: 'title',
            type: 'rawlist',
            message: "What is your new employee's title?",
            choices: roleArr
        },
        {
            name: 'manager_name',
            type: 'rawlist',
            message: "Who is your new employee's manager?",
            choices: empArr
        }
    ])
```

I wanted the user to be able to choose from the role titles instead of the role ids. I also wanted the user to be able to choose from employee full names instead of ids. The choices for each prompts are returned from the functions.

```javascript
const genRoleArr = (connection) => {
    let roleArr = [];
    connection.query(`SELECT * FROM roles`, (err, roles) => {
        if (err) {
            console.error(err);
        }
        for (i = 0; i < roles.length; i++) {
            roleArr.push(roles[i].title);
        };
    });
    return roleArr;
};
```

This helper function collects all role objects, iterates through them, and pushes each role title to roleArr, which is returned.

```javascript
const genEmpArr = (connection) => {
    let empArr = [];
    connection.query(`SELECT * FROM employees`, (err, employees) => {
        if (err) {
            console.error(err);
        }
        for (i = 0; i < employees.length; i++) {
            empArr.push(employees[i].first_name + " " + employees[i].last_name);
        };
    });
    return empArr;
};

```

This helper function collects all employee objects, iterates through them, and pushes each role title to empArr, which is returned.

```javascript
        let manID;
            connection.query(`SELECT * FROM employees`, (err, employees) => {
                if (err) {
                    console.error(err);
                }
                for (i = 0; i < employees.length; i++) {
                    if (response.manager_name.includes(employees[i].last_name)) {
                        manID = employees[i].id;
                    }
                }
            });
```

This section of the addEmp function selects all employee objects, then uses the manager_name response to see if it includes any last name in an employee object. If it does, it sets manID to equal the id from that employee object. This conversion is required in order to successfully enter the new employee into the employees table.

```javascript
            let roleID;
                connection.query(`SELECT * FROM roles`, (err, roles) => {
                    if (err) {
                        console.error(err);
                    }
                    for (i = 0; i < roles.length; i++) {
                        if (response.title === roles[i].title) {
                            roleID = roles[i].id;
                        }
                    }
                });
```

This section of the addEmp function selects all role objects, then sets iterates through them. If the title response equals a title in a role object, roleID is set to equal that object's role_id. This conversion is required in order to successfully insert the new employee into the employees table.

```javascript
connection.query(`INSERT INTO employees SET ?`, { first_name: response.first_name, last_name: response.last_name, role_id: roleID, manager_id: manID }, (err, res) => {
                        if (err) {
                            console.error(err);
                        } else {
                            connection.query(`SELECT * from employees`, (err, res) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    console.table(res);
                                    console.log(`New employee added.`)
                                }
                            });
                        };
                        start();
                    });
```

This section of the addEmp function inserts the response data and the converted manager id and role id into the employees table. If there is no error, it then returns the employees table.

NOTE: the employees table return, and other tables returned after an add______(), were disabled in the submitted code because they were interfering with running through the app. There were issues with tables being cut off while displayed, and the user sometimes had to press an up or down arrow key in order to see the choices. This did not interfere with the overall functionality of the app. Everything works 100% as intended and designed if the tables are returned after an add______().

---

## Technology

Technology Used:
* [GitHub](https://github.com/)
* [GitBash](https://gitforwindows.org/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Javascipt](https://www.javascript.com/)
* [node.js](https://nodejs.org/en/)
* [inquirer.js](https://www.npmjs.com/package/inquirer)
* [mySQL2](https://www.npmjs.com/package/mysql2)

---

## Credits

All coding credited to Phillip Besse. Code debugged with Kavya Mandla and Kevin Hernandez.

Websites Referenced:
* [DigitalOcean - Switch Case](https://www.digitalocean.com/community/tutorials/how-to-use-the-switch-statement-in-javascript)
* [Inquirer Docs](https://www.educative.io/answers/how-to-use-the-inquirer-node-package)
* [Educative.io - Switch Case](https://www.educative.io/answers/how-to-use-the-switch-statement-in-javascript)
* [mysql2](https://www.npmjs.com/package/mysql2)
* [W3 Schools - SQL PRIMARY KEY](https://www.w3schools.com/sql/sql_primarykey.ASP)

---

## Testing

There are no tests for this app.

---

## License

Phillip Besse's Employee Tracker is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

MIT License

Copyright (c) 2022 Phillip Besse

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---