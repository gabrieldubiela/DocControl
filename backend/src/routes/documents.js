const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', documentController.getAll);
router.post('/', documentController.create);
router.post('/generate-content', documentController.generateContent);
router.post('/:id/generate-pdf', documentController.generatePdf);

module.exports = router;