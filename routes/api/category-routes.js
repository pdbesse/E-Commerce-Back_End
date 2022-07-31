const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// returns all categories
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

// return one category by its id value
router.get('/:id', async (req, res) => {
  try {
    // find category by id (primary key)
    const categoryData = await Category.findByPk(req.params.id, {
      // include associated Product model(s)
      include: [
        { model: Product }
      ]
    });

    // if no matching category
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new category
router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }

});

// update a category by its id value
router.put('/:id', async (req, res) => {
  try {
    // update category with req.body
    const categoryData = await Category.update(req.body, {
      // if a category id matches request parameter id
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

// delete a category by its id value
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

module.exports = router;
