const express = require('express');
const router = express.Router();
const signatureService = require('../services/signatureService');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { id: userId } = req.user;
    
    const signature = await signatureService.signDocument(documentId, userId);
    
    res.json({ success: true, signature });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    
    const signatures = await signatureService.getDocumentSignatures(documentId);
    
    res.json(signatures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;