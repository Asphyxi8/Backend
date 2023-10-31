import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* View Update */

export const updateViews = async (req, res) => {
  try {
    console.log("Reached func babie");
    // Extract the user ID from the request parameters
    const { id } = req.params;
    // Find the user by their ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Increment the viewedProfile field by 1
    user.viewedProfile = (user.viewedProfile || 0) + 1;

    // Save the updated user
    await user.save();

    // Respond with the updated user
    res.status(200).json(user);
  } catch (err) {
    // Handle any errors
    res.status(500).json({ message: err.message });
  }
};


export const changeProfile = async (req,res) =>{
  try{
    console.log("1");
    const {id} = req.params;
    console.log("2");
    const user = await User.findById(id);
    console.log("3");
  const{
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation
  } = req.body;
  console.log("4");
   // Update user properties if provided in the request
   if (firstName) user.firstName = firstName;
   console.log("5");
   if (lastName) user.lastName = lastName;
   console.log("6");
   if (email) user.email = email;
   console.log("7");

   console.log("8");

   if (picturePath) user.picturePath = picturePath;
   console.log("9");
   if (friends) user.friends = friends;
   console.log("10");
   if (location) user.location = location;
   console.log("11");
   if (occupation) user.occupation = occupation;
   console.log("12");

   // Save the updated user
   const updatedUser = await user.save();
   console.log("13");

   res.status(200).json(updatedUser);
   console.log("14");
 } catch (err) {
  console.log("15");
   res.status(500).json({ error: err.message });
 }
};
