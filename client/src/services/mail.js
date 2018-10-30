'use strict';
require('dotenv').load();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// BROKEN BACKUP IGNORE DELETE LATER
const sendConfirmationEmail = async function(userid, email) {
    try {
        const emailToken = jwt.sign(
            {
                id: userid,
            },
            process.env.EMAIL_SECRET,
            {
                expiresIn: '1d',
            },
            (err, emailToken) => {
                // TODO: change to push error
                if(err) { return console.log(err) }
                // TODO: make a gmail account for this:
                const url = `https://111ca9c3f8bf49618e03fd4821b9610d.vfs.cloud9.us-west-2.amazonaws.com/confirm/${emailToken}`;
                let transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    secure: false, // true for 465, false for other ports
                    port: 587,
                    auth: {
                        user: 'bnn7gzozw7ynune6@ethereal.email',
                        pass: 'BxDCqVtEyH45bjMp22'
                    }
                });
                let mailOptions = {
                    from: '<no-reply@requestrbeta.com>',
                    to: email,
                    subject: 'Requestr: Confirm Account',
                    html: `Thanks for joining Requestr! 
                    Your confirmation link is: <a href="${url}">${url}</a>`
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        // TODO: change to push error
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                        }
                    );
                });
    } catch(err) {
        // TODO: change to push error
        console.log(err);
    }
};

module.exports = sendConfirmationEmail;
