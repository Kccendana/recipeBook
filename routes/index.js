const express = require("express");
const router = new express.Router();
const recipeRoutes = require('./recipes')
const contactRoutes = require('./contacts');
const passport = require("passport");


router.use('/recipes', recipeRoutes);
router.use('/contacts', contactRoutes)
router.use('/api-docs', require('./swagger'));

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next){
    req.logout(function(err) {
        if (err) { return next(err)}
        res.redirect('/');
    })
})
module.exports = router;