const userModel  = require('../../model/user-model/user.model');
const jsonwebtoken = require('jsonwebtoken');

const{
    generateJwtToken
}=require('../../helper/common.index');


signUp = (req,res)=>{
    const{
        firstName,
        lastName,
        email,
        password,
    }=req.body
    userModel.findOne({
        email: email
    }).exec((error,user)=>{
        if(error){
            return res.status(400).json({
                message:"please contact administration"
            })
        }
        if(user){
            return res.json({
                success:false,
                message:"This Email already exits"
            })
        }
        const _user = new userModel({
            firstName, lastName, email, password,
            userName: Math.random().toString()
        });
        _user.save((error,data)=>{
            if(error){
                console.log(error);
                return res.status(500).json({
                    success:false,
                    message:"bad authentication"
                })
            }
            if(data){
                const token = generateJwtToken(data._id, data.role);
                return res.status(200).json({
                    sucess:true,
                    message:"crate account successfully",
                    data:{
                        data,
                        token:token
                    }
                })
            }
        })
    })
}

signIn = (req,res)=>{
    const{
        email,
        password
    }=req.body
    userModel.findOne({
        email:email
    }).exec((error,data)=>{
        if(error){
            return res.status(500).json({
                success:false,
                message:"please contact administration"
            })
        }
        if(data){
            const token = generateJwtToken(data._id, data.role)
            const isAuthentication = data.authenticate(password);
            if(isAuthentication){
                return res.status(200).json({
                    success:true,
                    data:{
                        data,
                        token:token
                    }  
                })
            }else{
                return res.json({
                            success:false,
                            message:"User Login failed. Bad Authentication",

                })
            }
        }else{
            return res.json({
                success:false,
                message:"User Email Does not exist."
            })
        }
    })
}
module.exports = {
    signUp,
    signIn
}