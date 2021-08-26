const {Router, request} = require('express');
const router = Router();
const Todo = require('../modules/todo');
const Help = require('../helpers/todoHelper')

router.post('/', (req, res) => Help.get(req, res));
router.post('/add', (req, res) => Help.add(req, res));
router.post('/remove', (req, res) => Help.remove(req, res));
router.post('/update/up', async (req, res) => Help.updateUp(req, res));
router.post('/update/down', async (req, res) => Help.updateDown(req, res));

module.exports = router;