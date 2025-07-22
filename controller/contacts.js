const mongodb = require('../data/database');
const { ObjectId }  = require('mongodb');

const getAll = async (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Get all contacts'
  try {
    const db = mongodb.getDatabase();
    const result = await db.collection('contacts').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Error fetching data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getSingle = async (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Get contact by ID'

  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact ID format.' });
    }

    const contactId = new ObjectId(req.params.id);
    const db = mongodb.getDatabase(); 
    const result = await db.collection('contacts').find({ _id: contactId }).toArray();

    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result[0]);

  } catch (err) {
    console.error('❌ Error fetching data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const createContact = async (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Create new contact'
  try{
    const contact = {
    "firstName": req.body.firstName,
    "lastName": req.body.lastName,
    "email": req.body.email,
    "favoriteColor": req.body.favoriteColor,
    "birthday": req.body.birthday
        };
    const db = mongodb.getDatabase(); 
    const response = await db.collection('contacts').insertOne(contact);
    if (response.acknowledged > 0){
      res.status(201).json({
        success: true,
        message: 'New Contact created',
      });
    }else {
      res.status(500).json(response.error || "Some error occured while creating a new contact")
    }
  } catch (err) {
    console.error('❌ Error creating contact:', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

const updateContact = async (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Update a contact'

  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact ID format.' });
    }

    const contactId = new ObjectId(req.params.id);
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const db = mongodb.getDatabase();
    const response = await db.collection('contacts').replaceOne({ _id: contactId }, contact);

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully'
    });

  } catch (err) {
    console.error('❌ Error updating contact:', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

const deleteContact = async (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Delete a contact'
  try {
    // Validate the ID format
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact ID format.' });
    }

    const contactId = new ObjectId(req.params.id);
    const db = mongodb.getDatabase();
    const response = await db.collection('contacts').deleteOne({ _id: contactId });

    if (response.deletedCount > 0) {
      res.status(200).json({
        success: true,
        message: 'Contact deleted successfully'
      });
    } else {
      res.status(404).json({ message: 'Contact not found.' });
    }
  } catch (err) {
    console.error('❌ Error deleting contact:', err);
    res.status(500).json({ message: err.message || 'Some error occurred while deleting the contact' });
  }
};
;

module.exports= {getAll, getSingle, createContact, updateContact, deleteContact}
