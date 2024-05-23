const express = require('express');

const placesControllers = require('../controllers/places-controllers');

const router = express.Router();

router.get('/:pId', placesControllers.getPlaceById);

router.get('/user/:uId', placesControllers.getPlacesByUserId);

router.post('/', placesControllers.createPlace);

router.patch('/:pId', placesControllers.updatePlace);

router.delete('/:pId', placesControllers.deletePlace);

module.exports = router;
