const express = require("express");
const router = new express.Router();
const recipeRoutes = require('./recipes')

router.get("/", (req, res) => {
  // #swagger.tags = ['Hello World']
  res.send("Hello World")
});

router.use('/recipes', recipeRoutes);
router.use('/api-docs', require('./swagger'));



module.exports = router;