# Ecommerce-Back-End

## Description

This app allows the user to view, create, update, and delete categories, products, and tags in an ecommerce database.

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

The files for this program can be downloaded [here](https://github.com/pdbesse/ecommerce-back-end/archive/refs/heads/main.zip). 

This app requires node.js to be installed. For download and installation instructions, please see [nodejs.org](https://nodejs.org/en/download/).

This app also requires Sequelize, Express, Dotenv, and mySQL2 to be installed. To do this, open the terminal and navigate to the extracted folder. Enter: 
```
npm install
```
This will download any modules required for the app to work. 

A video walkthrough of the app can be viewed [here](https://www.youtube.com/watch?v=QSUMKTmwnF0).

---

## Usage

After downloading the files and installing the required modules, the user should update .env.EXAMPLE with the user's username and password for mysql. The user should then delete '.EXAMPLE' from the file name.

The user should open the mysql shell in the terminal after opening the terminal in the root directory. The user should enter 
```
mysql -u 'username' -p
```
and press enter. The user will then be prompted to enter the password.

The user should then enter 
```
source ./db/schema.sql
```
to create the database.

Finally, the user should enter 
```
use ecommerce_db;
```
to ensure the correct database is being used.


After creating the database in the mysql shell, the user should contol+c out of the shell. The user should then enter
```
npm run seed
``` 
to seed the data into the tables.

Lastly, the user should enter
```
npm start
```
to start the server. 

The routes can then be tested in Insomnia.

![usage-gif](./assets/ecom-back-end.gif)

---

## Code Snippets

Because all models and routes are similar, I will be highlighting just the Category model and routes.

```javascript
const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);

module.exports = Category;

```

The Category model is given an id as its primary key. This is used as a foreign key for the product model to create an association

```javascript
router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [
        { model: Product }
      ]
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});
```

This route returns all categories. Category.findAll() retrieves all Category models and includes the associated product models in the returned JSON data.

```javascript
router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [
        { model: Product }
      ]
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

```

This route returns the corresponding Category to a given id. Category.findByPk() takes the req.params.id as an argument and finds the associated Category id (primary key). It includes any associated Product models in the returned JSON data.

```javascript
router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }

});
```

This route creates a new Category in the database. Category.create() creates the entry in the database using the data provided in the req.body.

```javascript
router.put('/:id', async (req, res) => {
  try {
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      }
    });
    if (!categoryData) {
      res.status(400).json({ message: 'No category found with this id!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});       
```

This route updates a category corresponding to a given id. Category.update() takes the req.body as an argument and updates the data where the Category id matches the req.params.id.

```javascript
router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});      
```

This route deletes a category corresponding to a given id. Category.destroy deletes the Category where the Category id matches the req.params.id.

---

## Technology

Technology Used:
* [GitHub](https://github.com/)
* [GitBash](https://gitforwindows.org/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Javascipt](https://www.javascript.com/)
* [node.js](https://nodejs.org/en/)
* [Sequelize](https://sequelize.org/)
* [mySQL2](https://www.npmjs.com/package/mysql2)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [Express](https://expressjs.com/)
* [Insomnia](https://docs.insomnia.rest/)

---

## Credits

All coding credited to Phillip Besse.

---

## Testing

All routes are tested in Insomnia. See video linked above.

---

## License

Phillip Besse's Ecommerce Back End is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

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