const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [
        { model: Product }
      ]
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [
        { model: Product }
      ]
    }
    );
    // console.log(tagData);
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    };

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create(req.body)
  // console.log(req.body)
  .then((tag) => {
    // console.log(tag)
    if (req.body.productIds.length) {
      const productIdArr = req.body.productIds.map((product_id) => {
        // console.log(productIdArr)
        return {
          tag_id: tag.id,
          product_id,
        };
      });
      return ProductTag.bulkCreate(productIdArr);
    }
    res.status(200).json(newTag);
  })
  .then((tagProdIds) => res.status(200).json(tagProdIds))
  .catch ((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

// SIMPLIFIED
// router.post('/', async (req, res) => {
//   // create a new tag
//   try {
//     const tagData = await Tag.create(req.body, {
//       where: {
//         id: req.params.id,
//       }
//     });
//     if (!tagData) {
//       res.status(400).json({ message: 'No tag found with this id!' });
//       return;
//     }
//     res.status(200).json(tagData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { tag_id: req.params.id } });
    })
    .then((tagProducts) => {
      // console.log(tagProducts)
      // get list of current tag_ids
      const tagProductIds = tagProducts.map(({ product_id }) => product_id);
      // console.log(tagProductIds)
      // create filtered list of new tag_ids
      const newTagProducts = req.body.productIds
        .filter((product_id) => !tagProductIds.includes(product_id))
        .map((product_id) => {
          // console.log(product_id)
          return {
            tag_id: req.params.id,
            product_id,
          };
        });
        // console.log(tagProductIds);
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
      // console.log(err);
      res.status(400).json(err);
    });
});

// SIMPLIFIED
// router.put('/:id', async (req, res) => {
//   // update a tag's name by its `id` value
//   try {
//     const tagData = await Tag.update(req.body, {
//       where: {
//         id: req.params.id,
//       },
//     });
//     if (!tagData) {
//       res.status(400).json({ message: 'No tag found with this id!' });
//       return;
//     }
//     res.status(200).json(tagData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
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
