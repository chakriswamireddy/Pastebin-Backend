const express = require('express')
const { createPaste, getPaste } = require('../controllers/createPaste')

const router = express.Router()

router.post('/pastes', createPaste)
router.get('/pastes/:id', getPaste)
