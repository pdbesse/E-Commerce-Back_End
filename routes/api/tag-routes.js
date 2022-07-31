const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// return all tags
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      // include associated Product model(s)
      include: [
        { model: Product }
      ]
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// return tag by its id value
router.get('/:id', async (req, res) => {
  try {
    // find tag by id (primary key)
    const tagData = await Tag.findByPk(req.params.id, {
      include: [
        { model: Product }
      ]
    }
    );
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    };

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new tag
router.post('/', (req, res) => {
  Tag.create(req.body)
  .then((tag) => {
    // if there are product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.productIds.length) {
      const productIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: tag.id,
          product_id,
        };
      });
      return ProductTag.bulkCreate(productIdArr);
    }
    // if no product tags, just respond
    res.status(200).json(newTag);
  })
  .then((tagProdIds) => res.status(200).json(tagProdIds))
  .catch ((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

// update tag by id
router.put('/:id', (req, res) => {
  // update tag data where tag id matches req.params.id
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => {
      // find all associated products from ProductTag
      return ProductTag.findAll({ where: { tag_id: req.params.id } });
    })
    .then((tagProducts) => {
      // get list of current product_ids
      const tagProductIds = tagProducts.map(({ product_id }) => product_id);
      // create filtered list of new product_ids
      const newTagProducts = req.body.productIds
        .filter((product_id) => !tagProductIds.includes(product_id))
        .map((product_id) => {
          return {
            tag_id: req.params.id,
            product_id,
          };
        });
      // figure out which ones to remove
      const tagProductsToRemove = tagProducts
        .filter(({ product_id }) => !req.body.productIds.includes(product_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: tagProductsToRemove } }),
        ProductTag.bulkCreate(newTagProducts),
      ]);
    })
    .then((updatedTagProducts) => res.json(updatedTagProducts))
    .catch((err) => {
      res.status(400).json(err);
    });
});

// delete tag by its id value
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
