import User from "../models/userModel";
import jwt from 'jsonwebtoken';

const JWT_SECRET= "yuor_jwt_sercet_here";

export default async function authMiddleware(req, res, next) {
    // grab the token 
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.starsWith("bearer")) {
        return res.status(401).json({
            success: false,
            message : "Not authirized or token missing"
        });
    }
    const token = authHeader.split("")[1]

    //to verify  the token
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id).select("-password");
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
        req.user = user;
        next();
    }

    catch (err) {
        console.error("jwt verification fialed" , err);
        return res.status(401).json({
            success: false,
            message : "token invalid or expired"
        })
    }
}