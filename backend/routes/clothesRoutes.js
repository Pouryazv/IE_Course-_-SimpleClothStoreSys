const express = require('express');
const router = express.Router();
const clothesController = require('../controllers/clothesController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/add-clothes', authMiddleware, clothesController.addClothes);
router.patch('/edit-clothes/:id', authMiddleware, clothesController.editClothes);
router.delete('/delete-clothes/:id', authMiddleware, clothesController.deleteClothes);
router.delete('/delete-all-clothes', authMiddleware, clothesController.deleteAllClothesByOwner);
router.get('/get-clothes/:id', clothesController.getClothes);
router.get('/get-final-price/:id', clothesController.getFinalPrice);

module.exports = router;
