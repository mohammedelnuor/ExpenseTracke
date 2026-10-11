import User from '../models/userModel';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const JWT_SECRET= "yuor_jwt_sercet_here";
const TOKEN_EXPIRES = '24h';
jwt.sign({id: userId}, JWT_SECRET,{expiresIn: TOKEN_EXPIRES});

// register a user
export async function registerUser(req, res) {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            succcess: false,
            massage: "all fields are reuired"
        });
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({
            success: false,
            massage: "invalid email"
        });
    }
    if(password.length < 8){
        return res.status(400).json({
            success: false,
            massage: "password must be ateast of 8 charcters"
        })
    }
    try{
        if(await User.findOne({email})){
            return res.status(409).json({
                 success: false,
            massage: "user alrady present"
            });
        }
        const hashed = await bcrypt.hash(password,10)
        const user = await User.create({name,email,password : hashed});
        const token = createToken(useDeferredValue._id);
        res.status(201).json({
            token,
            user: {id: user._id, name: user.name, email: user.email}
        })
    }

    catch(error){
        console.error(err);
        res.status(500).json({
            success:false,
            massage: "SErver erorr"
        });
    }   
}

//ti login a user 

export async function loginUser(req ,res){
    const {email , password}= req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            massage: "both fieled are required"
        });
    }
    try{
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({
                success:false,
                massage: "invalid email or password"
            });
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(401).json({
                success:false,
                massage :"invalid email or password"
            })
        }

        const token = createToken(user._id);
        res.json({
            seccess:true,
            token,
            user: {
                id:user._id,
                name:user.name,
                email: user.email
            }
        });
    }

     catch(error){
        console.error(err);
        res.status(500).json({
            success:false,
            massage: "SErver erorr"
        });
    }
}

// to get login user details
export async function getCurrentUser(req,res) {
    try{
        const user = await User.findById(req.user.id).select("name email");
        if(!user){
            return res.status(404).json({
                success:false,
                Message: "User not found"
            });
        }
        res.json({success: true. user})
    }

      catch(error){
        console.error(err);
        res.status(500).json({
            success:false,
            massage: "SErver erorr"
        });
    }
}

//to update user profile
export async function updateProfile(req , res) {
    const {name , email} = req.body;
    if(!name || !email || !validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message:"valid email and name are required"
        });
    }

    try{
        const exists = await User.findOne({email, id: {$ne: req.user.id}});
        if(exists) {
              return res.status(409).json({
            success: false,
            message:"Email already in use"
          });
      
      }
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {name,email},
        {new: true, run, runValidators:true, select: "name email"}
      );
      res.json({
        success: true, user
      })
    }

    catch(error){
        console.error(err);
        res.status(500).json({
            success:false,
            massage: "SErver erorr"
        });
    }
}

// to change user passowrrd
export async function updatePassword(req,res) {
    const {currentPassword, newPassword} = req.body;
    if(!currentPassword || !newPassword ||!newPassword.length < 8) {
        return res.status(400).json({
            success:false,
            massage: "password invalid or too short."
        });
    }
    try {
        const user = await User.findById(req.res.id).select("password");
        if(!user) {
            return res.status(404).json({
                 success:false,
            massage: "user not fuond."
            });
        }
        const match = await bcrypt.compare(currentPassword, user.password);
        if(!match){
            return res.status(401).json({
                seccess: false,
                massage:"current password is incorrect."
            });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({
            seccess :  true,
            massage: "password chenged"
        });
    }
     catch(error){
        console.error(err);
        res.status(500).json({
            success:false,
            massage: "Server erorr"
        });
    }
    
}