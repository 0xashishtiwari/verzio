const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');
dotenv.config();
const uri = process.env.MONGO_URL ;
const chalk = require('chalk');
const ObjectId = require('mongodb').ObjectId;

let client;

async function connectClient() {
  if(!client){
    client = new MongoClient(uri , {});
  }
  await client.connect();
}

const signup = async (req, res) => {
    const {username , password  , email} = req.body;
    try {
      await connectClient();
      const db = client.db("verzio");
      const userCollection = db.collection("users");
      
      let user = await userCollection.findOne({username});
       
      if(user){
        return res.status(400).json({message : "Username already exists"});

      }
      user = await userCollection.findOne({email});
      if(user){
        return res.status(400).json({message : "Email already exists"});

      }

      const salt =  await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      
      const newUser = {
        username,
        password : hash,
        email,
        repositories : [],
        followedUsers : [],
        starRepositories : []
      }
      
      const result = await userCollection.insertOne(newUser);
      // console.log(result);
      const token = jwt.sign( { id:result.insertedId} , process.env.JWT_SECRET_KEY, {
        expiresIn : "1h"
      })
      
      return res.json({token , userId : result.insertedId});
    } catch (error) {
        console.error(chalk.redBright("Error during signup : " , error.message))
        res.status(500).send("Server error");
        
    }
};

const login = async (req, res) => {


  const {email , password} = req.body;
  try {
    await connectClient();
    const db = client.db("verzio");
      const userCollection = db.collection("users");

      const user = await userCollection.findOne({email});
      if(!user){
        return res.status(400).json({message : "Invalid credentials!"});
      }
      
      const isMatch = await bcrypt.compare(password , user.password);
      
      if(!isMatch){
        
        return res.status(400).json({message : "Invalid credentials!"});
      }

      const token = jwt.sign({id:user._id} , process.env.JWT_SECRET_KEY , {expiresIn : "1h"})
    return   res.json({token , userId : user._id});
  } catch (err) {
      console.error(chalk.red('Error during login :' , err.message));
      res.status(500).json({message : "Server error"})
    }
    
  };
  const getAllUsers = async (req, res) => {
    try {
      await connectClient();
      const db = client.db("verzio");
      const userCollection = db.collection("users");

      const users = await userCollection.find({}).toArray();
      // console.log(users);
      res.status(200).json(users , {message : "All users fetched"});
    } catch (err) {
      console.error(chalk.red('Error during fetching users :' , err.message));
      res.status(500).json({message : "Server error"})
      
    }
};

const getUserProfile = async(req, res) => {
  const currentID = req.params.id;
  try {
      await connectClient();
      const db = client.db("verzio");
      const userCollection = db.collection("users");
      
      const user = await userCollection.findOne({_id :  new ObjectId(currentID) });
      if(!user){
        return res.status(400).json({message : "user not found"});
      }
    return    res.send(user);
  } catch (err) {
      console.error(chalk.red('Error during fetching user :' , err.message));
      res.status(500).json({message : "Server error"})
  }
};

const updateUserProfile = async(req, res) => {
  const currentID = req.params.id;
  const { email , password } = req.body;

  try {
      await connectClient();
      const db = client.db("verzio");
      const userCollection = db.collection("users");
      
    let updateFields = {email};
    if(password){
     const salt =  await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      updateFields.password = hash;
    }

    const result = await userCollection.findOneAndUpdate({
        _id :  new ObjectId(currentID)
    } , {$set : updateFields} , {returnDocument  : "after"});
    // console.log(result);

    if(!result){
      return res.status(404).json({message : "User not found"})
    }

    res.send(result);
  } catch (err) {
    console.error(chalk.red('Error during updating user :' , err.message));
      res.status(500).json({message : "Server error"})
  }
};
const deleteUserProfile = async(req, res) => {
 const currentID = req.params.id;

 try {
    await connectClient();
      const db = client.db("verzio");
      const userCollection = db.collection("users");
      const result = await userCollection.deleteOne({_id : new ObjectId(currentID)});
      
      if(result.deletedCount==0){
        res.status(404).json({message : "User not found"});
      }
      res.json({message : "User profile Deleted!"})
 } catch (err) {
     console.error(chalk.red('Error during deleting user :' , err.message));
      res.status(500).json({message : "Server error"})
 }
};

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
