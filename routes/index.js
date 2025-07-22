const express = require("express");
const router = new express.Router();
const recipeRoutes = require('./recipes')
const contactRoutes = require('./contacts')
router.get("/", (req, res) => {
  // #swagger.tags = ['Hello World']
  res.send("Hello World")
});

router.use('/recipes', recipeRoutes);
router.use('/contacts', contactRoutes)
router.use('/api-docs', require('./swagger'));



module.exports = router;