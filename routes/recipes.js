const express = require("express");
const router = express.Router();
const recipeController = require("../controller/recipes");
const validation = require('../middleware/validate');
const authenticate = require('../middleware/authenticate')

router.get('/', recipeController.getAll);

router.get("/:id", recipeController.getSingle);

router.post("/", authenticate.isAuthenticated, validation.saveRecipe, recipeController.createRecipe);

router.put("/:id", authenticate.isAuthenticated, validation.saveRecipe, recipeController.updateRecipe);

router.delete("/:id", authenticate.isAuthenticated, recipeController.deleteRecipe);

module.exports = router;