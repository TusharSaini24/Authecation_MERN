const User = require('../model/userSch');
const otpGenerator= require('otp-generator');
const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service : 'Gmail',
    
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
    
});



exports.login= (req,res)=>{

    const { email , password } = req.body;
    User.findOne({email:email},(err,user)=>{
        if(user)
        {
            if(password == user.password)
            {
                res.send({message : " Login Successfull !!!" , user:user})
            }
            else
            {
                res.send({message : " Wrong Password !!!"})
            }
        }
        else
        {
            res.send({message : " User Is Not Registered !!!"});
        }
    })
    
}

exports.register = (req,res)=>{
    const {name , email , password } = req.body;
    User.findOne({email:email},(err,user)=>{
        if(user)
        {
            res.send({message : " User already Registered !!!"});
        }
        else
        {
            var otp = otpGenerator.generate(6, { lowerCaseAlphabets: false ,upperCaseAlphabets: false, specialChars: false });
            const dt = new Date();
            const createdAt = dt.getMilliseconds();
            console.log("created At :",createdAt);
            const user = new User({
                name,
                email,
                password,
                otp,
                createdAt

            })
        
            user.save(err=>{
                if(err)
                {
                    res.send(err);
                }
                else
                {
                    
                    var mailOptions={
                        to: email,
                       subject: "Otp for registration is: ",
                       html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
                     };
                     
                     transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        // console.log('Message sent: %s', info.messageId);   
                        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    });

                    res.send({message : " Email Has been sent !!!"})
                }
            })
        }
    })

}

exports.update = async(req,res)=>{
    const {name , email , password } = req.body;
    
   const person =  await User.findOne({email:email});
   const id = person._id;

   const data = {
       name,
       email,
       password
   }

   const result = await User.findByIdAndUpdate(id,data,{new:true});
   
   res.send({message:"SuccessFully Updated !!!"});

}

exports.verifyotp = async(req,res)=>{
   
//    console.log(req.body);
   const {otp,email}= req.body;
   
   const person =  await User.findOne({email:email});
   const personID = person._id;
   const personOTP = person.otp;
//    console.log("person otp : ",personOTP);

   const dt = new Date();
   const currmilisecond = dt.getMilliseconds();
   console.log('mili : ', currmilisecond);


   if(otp === personOTP)
   {
        var mailOptions={
            to: email,
        subject: "Email Verified ",
        html: "<h3> Email is Verified !!! Thank you for Sign Up  </h3>"  
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            // console.log('Message sent: %s', info.messageId);   
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
       res.send({message : "Email Verification Completed !!!", ans:1} );
   }
   else
   {
        User.deleteOne({personID}, function(err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
        });
       res.send({message : " InCorrect OTP !!!" , ans : 0});
   }
   

}


