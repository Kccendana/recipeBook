// module.exports = router;
const express = require("express");
const router = express.Router();
const contactsController = require("../controller/contacts");
const validation = require('../middleware/validate');
const authenticate = require('../middleware/authenticate')

router.get("/", contactsController.getAll);

router.get("/:id", contactsController.getSingle);

router.post("/", authenticate.isAuthenticated, validation.saveContact, contactsController.createContact);

router.put("/:id", authenticate.isAuthenticated, validation.saveContact, contactsController.updateContact);

router.delete("/:id",authenticate.isAuthenticated, contactsController.deleteContact);

module.exports = router;
