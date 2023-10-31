import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async(req,res)=>{
try{
const {userId,description,picturePath,videoPath} = req.body;
const user = await User.findById(userId);
const newPost = new Post({
    userId,
    firstName: user.firstName,
    lastName: user.lastName,
    location: user.location,
    description,
    userPicturePath: user.picturePath,
    picturePath,
    videoPath,
    likes:{},
    comments:[],
})
await newPost.save()
const post = await Post.find()
res.status(201).json(post) //successful creation
}catch(err){
    res.status(409).json({message:err.message}) //creation error    
}

}


/* Read */

export const getFeedPosts = async(req,res) =>{
    try{
        const post = await Post.find();
        res.status(200).json(post);
    }catch(err){
        res.status(404).json({message:err.message})
    }
}


export const getUserPosts = async(req,res)=>{
    try{
        const {userId} = req.params
        const post = await Post.find({userId});
        res.status(200).json(post);
    }catch(err){
        res.status(404).json({message:err.message})
    }
}


/* UPDATE */

export const likePost = async(req,res)=>{
    try{
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
        if(isLiked){
            post.likes.delete(userId);
        }else{
            post.likes.set(userId,true); 
        }
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );
        res.status(200).json(updatedPost)
    }catch(err){
        res.status(404).json({message:err.message})
    }
}

/* Delete */

export const deletePost = async (req, res) => {
    try {
        console.log(1);
        const { id } = req.params;
        console.log(2);

        const post = await Post.findById(id);
        console.log(3);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        console.log(4);

        // Check if the user has the necessary permissions to delete the post
        /*if (post.userId.toString() !== req.body.userId.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }*/

        // Use deleteOne() to remove the post
        const result = await Post.deleteOne({ _id: id });
        if (result.deletedCount === 1) {
            console.log(5);

            res.status(204).send(); // No content response, indicating successful deletion
            console.log(6);
        } else {
            console.error("Post was not deleted.");
            res.status(500).json({ message: "Failed to delete the post" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


/*COMMENT*/
export const addComment = async(req,res)=>{
    console.log(req.body);
    console.log("1");
    const { comment } = req.body;
    console.log("2");
    const { id } = req.params;
    console.log("3");
    const post = await Post.findById(id);
    console.log("4");
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    console.log("5"+comment);
    post.comments.push(comment);
    console.log("6");
    try {
        console.log("7");
        await post.save();
        console.log("8");
        res.status(200).json({ message: "Comment added successfully", post });
        console.log("9");
    } catch (error) {
        res.status(500).json({ message: "Failed to add the comment" });
    }
}
