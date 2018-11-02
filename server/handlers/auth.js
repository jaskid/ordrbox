require('dotenv').load();
const db = require('../models');
const jwt = require('jsonwebtoken');
const { sendConfirmationEmail } = require('./mail');

exports.signin = async function(req,res,next) {
    try {
        console.log('signing in...');
        // finding a user
        let user = await db.User.findOne({
            email: req.body.email
        });
        let { id, name, confirmed } = user;
        // check if pw matches
        let isMatch = await user.comparePassword(req.body.password);
        // if match, log in
        if(isMatch) {
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
        } else {
            return next({
                status: 400,
                message: "Invalid email and/or password."
            });
        }
    } catch(err) {
        return next({
            status: 400,
            message: "Invalid email and/or password."
        });
    }
};

exports.signup = async function(req,res,next) {
    try {
        let { email, password, confirm_password, name, beta, beta_access } = req.body;
        if(!(email.includes('@') && email.includes('.')) || email.length < 3) {
            throw {message:'Please enter a valid email address.'};
        }
        if (password.length < 6) {
          throw {message:'Your password must be at least 6 characters long.'};
        } else if (password.search(/[a-z]/) < 0) {
          throw {message:'Your password must include a lower case letter.'};
        } else if(password.search(/[A-Z]/) < 0) {
          throw {message:'Your password must include an upper case letter.'};
        } else  if (password.search(/[0-9]/) < 0) {
          throw {message:'Your password must include a number.'};
        }
        if((typeof confirm_password != 'undefined') && (password !== confirm_password)) {
            throw {message:"Passwords don't match."};
        }
        if(name === ' ') {
            throw {message:'Please enter a name.'};
        }
        if(name.split(' ')[0].length < 1) {
            throw {message:'Please enter a first name.'};
        }
        if(name.split(' ')[1].length < 1) {
            throw {message:'Please enter a last name.'};
        }
        
        if(beta && beta_access !== 'auris') {
            throw {message: 'Incorrect beta access code!'};
        }
        
        let user = await db.User.create({email, password, name});
        let { id, confirmed } = user;
        
        // sendConfirmationEmail(id, email);
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
        // if a validation fails!
        if(err.code === 11000) {
            err.message = "Sorry, that username and/or email is already taken!";            
        }
        return next({
            status: 400,
            message: err.message
        });
    }
};

exports.join = async function(req,res,next){
    try {
        let group = await db.Group.findOne({
            handle: req.body.handle
        });
        let isMatch = await group.comparePassword(req.body.password);
        if(isMatch) {
            group.members.push(req.body.userid);
            await group.save();
            
            let foundUser = await db.User.findById(req.body.userid);
            foundUser.groups.push(group.id);
            await foundUser.save();
            
            const { id } = group;
            return res.status(200).json({ id });
        } else {
            return next({
                status: 400,
                message: "Invalid group handle and/or password."
            });
        }
    } catch(err) {
        return next({
            status: 400,
            message: "Invalid group handle and/or password."
        });
    }
};