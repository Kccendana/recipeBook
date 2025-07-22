const { response } = require('express');
const mongodb = require('../data/database');
const { ObjectId }  = require('mongodb');

const getAll = async (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.description = 'Get all recipes'
  try {
    const db = mongodb.getDatabase();
    const result = await db.collection('recipes').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Error fetching data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getSingle = async (req, res, next) => {
  // #swagger.tags = ['Recipes']
  // #swagger.description = 'Get recipe by ID'
  try {
    if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid recipe ID format.' });
  }

    const recipeId = new ObjectId(req.params.id);
    const db = mongodb.getDatabase();
    const result = await db.collection('recipes').find({ _id: recipeId }).toArray();

    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result[0]);

  } catch (err) {
    console.error('❌ Error getting the recipe:', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};


const createRecipe = async (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.description = 'Create a new recipe'

  try {
    const {
      title,
      description,
      ingredients,
      steps,
      prepTime,
      cookTime,
      tags = [],
      servings
    } = req.body;

    // Always set createdAt here, do NOT allow client override
    const recipe = {
      title,
      description,
      ingredients,  // array of objects { name, quantity, unit }
      steps,        // array of strings
      prepTime,
      cookTime,
      tags,
      servings,
      createdAt: new Date()
    };

    const db = mongodb.getDatabase();
    const response = await db.collection('recipes').insertOne(recipe);

    if (response.acknowledged) {
      res.status(201).json({
        success: true,
        message: 'Recipe created',
        id: response.insertedId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create recipe'
      });
    }
  } catch (err) {
    console.error('❌ Error creating recipe:', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

const updateRecipe = async (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.description = 'Update a recipe by ID'

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must use a valid recipe id to update.');
  }

  const recipeId = new ObjectId(req.params.id);

  try {
    const {
      title,
      description,
      ingredients,
      steps,
      prepTime,
      cookTime,
      tags = [],
      servings
    } = req.body;

    const recipeUpdate = {
      title,
      description,
      ingredients,
      steps,
      prepTime,
      cookTime,
      tags,
      servings
    };

    const db = mongodb.getDatabase();

    // Update only specified fields, keep other fields like _id, createdAt unchanged
    const response = await db.collection('recipes').updateOne(
      { _id: recipeId },
      { $set: recipeUpdate }
    );

    if (response.modifiedCount > 0) {
      res.status(200).json({
        success: true,
        message: 'Recipe updated successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Recipe not found or no changes detected'
      });
    }
  } catch (err) {
    console.error('❌ Error updating recipe:', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

const deleteRecipe = async (req, res) => {
    // #swagger.tags = ['Recipes']
    // #swagger.description = 'Delete a recipe by ID'
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Must use a valid recipe id to delete.' });
  }
  try {
    const recipeId = new ObjectId(req.params.id);
    const db = mongodb.getDatabase(); 
    const response = await db.collection('recipes').deleteOne({ _id: recipeId });

    if (response.deletedCount > 0) {
      res.status(200).json({
        success: true,
        message: 'Recipe deleted successfully'
      }) // success, no content
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while deleting the user' });
  }
};

module.exports= {getAll, getSingle, createRecipe, updateRecipe, deleteRecipe}