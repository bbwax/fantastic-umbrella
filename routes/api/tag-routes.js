const router = require('express').Router();
const { Router } = require('express');
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [
        {
          model: Product,
        },
      ],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findByPk(req.params.id, {
    include: [
      {
        model: Product,
      },
    ],
  })
    .then(category => {
      if (!category) {
        return res.status(404).json({ message: 'Tag not found' });
      }
      res.json(category);
    })
    .catch(err => res.status(400).json(err));
});

router.post('/', async (req, res) => {
  // create a new tag
  const { tag_name } = req.body;
  console.log("req.body ", req.body);
  try {
    const newTag = await Tag.create({ tag_name });
    res.status(201).json(newTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  const { id } = req.params;
  const { tag_name } = req.body;
  try {
    const [updatedRowsCount, updatedTags] = await Tag.update({ tag_name }, {
      where: { id },
      returning: true,
    });
    res.status(200).json(updatedTags[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => res.json({ message: 'Tag deleted' }))
    .catch(err => res.status(400).json(err));
});


module.exports = router;
