const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../models');

// HANDLERS
const { signup, signin, join } = require('../handlers/auth');

// MIDDLEWARE
const { loginRequired } = require('../middleware/auth');

router.get('/confirm/:token', async function(req, res, next) {
    try {
        console.log('::RUNNING CONFIRMATION...::');
        const { id } = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
        const user = await db.User.findByIdAndUpdate(id, {confirmed: true}, {new: true});
        
        const { name, confirmed } = user;
        let token = jwt.sign(
            {
                id,
                name,
                confirmed
            },
            process.env.SECRET_KEY
        );
        return res.status(200).json({
            id,
            name,
            confirmed,
            token
        });
    } catch(err) {
       return next(err);
    }
});
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/join', loginRequired, join);

module.exports = router;