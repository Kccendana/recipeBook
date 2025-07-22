const validator = require('../helpers/validate');

const saveRecipe = (req, res, next) => {
  const validationRule = {
    title: 'required|string|min:3',
    description: 'required|string|min:10',
    'ingredients': 'required|array|min:1',
    'ingredients.*.name': 'required|string|min:1',
    'ingredients.*.quantity': 'required|numeric|min:1',
    'ingredients.*.unit': 'required|string|min:1',
    steps: 'required|array|min:1',
    'steps.*': 'string|min:5',
    prepTime: 'required|numeric|min:1',
    cookTime: 'required|numeric|min:1',
    tags: 'array',
    'tags.*': 'string|min:1',
    servings: 'required|numeric|min:1'
    // createdAt is optional and handled by default in schema
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    }
    next();
  });
};

module.exports = {
  saveRecipe
};