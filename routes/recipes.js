const express = require("express");
const router = express.Router();
const recipeController = require("../controller/recipes");
const validation = require('../middleware/validate');

router.get('/', recipeController.getAll);

router.get("/:id", recipeController.getSingle);

router.post("/", validation.saveRecipe, recipeController.createRecipe);

router.put("/:id", validation.saveRecipe, recipeController.updateRecipe);

router.delete("/:id", recipeController.deleteRecipe);

module.exports = router;