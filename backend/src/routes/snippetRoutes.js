const express = require('express');
const router = express.Router();
const snippetController = require('../controllers/snippetController');

router.get('/', snippetController.getAllSnippets);
router.post('/', snippetController.createSnippet);
router.put('/:id', snippetController.updateSnippet);
router.delete('/:id', snippetController.deleteSnippet);

module.exports = router;
