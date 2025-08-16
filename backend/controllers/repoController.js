const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");
const chalk = require('chalk');


const createRepository = async (req, res) => {
  const {owner , name , issues , content , description, visibility} = req.body;

  try {
      if(!name){
        return res.status(400).json({message : "Repository name required"});
      }
      if(!mongoose.Types.ObjectId.isValid(owner)){
        return res.status(400).json({message : "Invalid user id!"});
      }
     const newRepository = new Repository({
      name , description , visibility, owner,content,issues
     });

     const result = await newRepository.save();

     //Adding repo to user repo array

     await User.findByIdAndUpdate(owner , {$push :{repositories : result._id}});

     res.status(201).json({
      message : "Repository created",
      respositoryID : result._id
     })

  } catch (err) {
    console.error(chalk.red("Error during creating repository :", err.message));
    res.status(500).json({ message: "Server error" });
  }
};

const getAllRepositories = async (req, res) => {

    try {
      const repositories = await Repository.find({}).populate("owner").populate("issues");
      return res.json(repositories);
    } catch (err) {
       console.error(chalk.red("Error during fetching repositories :", err.message));
    res.status(500).json({ message: "Server error" });
  }
};

const fetchRepositoryById = async (req, res) => {
  const repoID = req.params.id;
    try {
      const repository = await Repository.find({_id : repoID}).populate("owner").populate("issues");
      if(!repository){
        return res.status(400).json({message : "Repository not found"});
      }
      return res.json(repository);
  } catch (err) {
    
    console.error(chalk.red("Error during fetching repository :", err.message));
    res.status(500).json({ message: "Server error" });
    }
};


const fetchRpositoryByName = async (req, res) => {
    const repoName = req.params.name;
    try {
      const repository = await Repository.find({name : repoName}).populate("owner").populate("issues");
      if(!repository){
        return res.status(400).json({message : "Repository not found"});
      }
      return res.json(repository);
  } catch (err) {
    
    console.error(chalk.red("Error during fetching repository :", err.message));
    res.status(500).json({ message: "Server error" });
    }
};

const fetchRepositoryForCurrentUser = async (req, res) => {
    const userId = req.user;
    try {

      const repositories = await Repository.find({owner : userId});
      if(!repositories || repositories.length==0)
        return res.status(404).json({message : "User repositories not found"});
      
      return res.status(201).json({message : "Repositories found" , repositories});
      
    } catch (err) {
      
      console.error(chalk.red("Error during fetching user repository :", err.message));
      res.status(500).json({ message: "Server error" });
      
    }
  };
  
  
  const updateRepositoryById = async (req, res) => {
    const {id} = req.params;
    const {content , description} = req.body;
    try {

      const repository = await Repository.findById(id);
      if(!repository)
       return res.status(404).json({message : "Repository not found"});

        repository.content.push(content);
        repository.description = description;
        const updatedRepository = await repository.save();

        return res.status(200).json({message : "Repository Updated" , updatedRepository});

      } catch (err) {
      console.error(chalk.red("Error during updating repository :", err.message));
      res.status(500).json({ message: "Server error" });

  }

};
const toggleVisibilityById = async (req, res) => {
  const {id} = req.params;
  
    try {

      const repository = await Repository.findById(id);
      if(!repository)
       return res.status(404).json({message : "Repository not found"});

        repository.visibility = !repository.visibility;
       
        const updatedRepository = await repository.save();

        return res.status(200).json({message : "Repository visibility toggled successfully" , updatedRepository});
        
      } catch (err) {
      console.error(chalk.red("Error during updating repository :", err.message));
      res.status(500).json({ message: "Server error" });

  }
};


const deleteRepositoryById = async (req, res) => {
  const {id} = req.params;
  try {
      // 1. Delete the repository itself
    const repository =  await Repository.findByIdAndDelete(id);
    
    if(!repository)
     return res.status(404).json({message : "Repository not found"});

    return res.status(200).json({message : "Repository deleted successfully"})
  } catch (err) {
     console.error(chalk.red("Error during deleting repository :", err.message));
      res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRpositoryByName,
  fetchRepositoryForCurrentUser,
  updateRepositoryById,
  deleteRepositoryById,
  toggleVisibilityById,
};
