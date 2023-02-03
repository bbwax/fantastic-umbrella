const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoriesData = await Category.findAll({
      include: [
        {
          model: Product,
        },
      ],
    });
    res.status(200).json(categoriesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findByPk(req.params.id, {
    include: [
      {
        model: Product,
      },
    ],
  })
    .then(category => {
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    })
    .catch(err => res.status(400).json(err));
});

router.post('/', async (req, res) => {
  // create a new category

  const { category_name } = req.body;
  console.log("req.body ", req.body);
  try {
    const newCategory = await Category.create({ category_name });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  const { id } = req.params;
  const { category_name } = req.body;
  try {
    const [updatedRowsCount, updatedCategories] = await Category.update({ category_name }, {
      where: { id },
      returning: true,
    });
    res.status(200).json(updatedCategories[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => res.json({ message: 'Category deleted' }))
    .catch(err => res.status(400).json(err));
});

module.exports = router;
