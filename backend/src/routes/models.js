const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', modelController.getAll);
router.post('/', modelController.create);
router.put('/:id', modelController.update);
router.delete('/:id', modelController.delete);

module.exports = router;