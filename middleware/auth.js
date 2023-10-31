import jwt from "jsonwebtoken"

export const verifyToken = async (req,res,next)=>{
    try{
        let token = req.header("Authorization");
        //what we're doing here is, from the request (which is the front end) ka header, we are grabbing "Authorization" header, and that's where
        //the token is set right, so we are grabbing it in the backend, and puttng it inside the 'token' (let token = ... (look @ line 5)) key

        if (!token){
            return res.status(403).send("Access Denied")
        }
        if (token.startsWith("Bearer ")){
            token = token.slice(7,token.length).trimLeft();
        }
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        req.user = verified;
        next();
        //for middleware, we use next() function so that it proceeds to the next state of the function
    }catch(err){
        res.status(500).json({error:err.message})
    }
}