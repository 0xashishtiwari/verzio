const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");
const chalk = require('chalk');



const createIssue = async (req, res) => {
    
    const {title , description} = req.body;
    const {id} = req.params;

    try {
       const issue = new Issue({
      title,
      description,
      repository : id
    })
    await issue.save();
    return res.status(201).json({message : "Issue created successfully" ,issue});
    } catch (err) {
      console.error(chalk.red("Error during creating issue :", err.message));
          res.status(500).json({ message: "Server error" });
    }
    
};


const updateIssueById = async(req, res) => {
  const {id } = req.params;
  const {title , description , status} = req.body;
  try {
    const issue = await Issue.findById(id);
    if(!issue){
      return res.status(404).json({message :"Issue does not exists"})
    }

    issue.title = title;
    issue.description = description;
    issue.status = status;

   const updatedIssue =  await issue.save();
    return res.status(200).json({message : "Issue updated successfully" , updatedIssue});
  } catch (err) {
    console.error(chalk.red("Error during updating issue :", err.message));
          res.status(500).json({ message: "Server error" });
  }
};

const deleteIssueById = async(req, res) => {
const {id} = req.params;
try {
    const issue = Issue.findByIdAndDelete(id);
    if(!issue){
      return res.status(404).json({message : "Issue not found"});

    }

    return res.status(200).json({message : "Issue deleted successfully" , issue});
} catch (err) {
    console.error(chalk.red("Error during deleting issue :", err.message));
          res.status(500).json({ message: "Server error" });
}
};


const getAllIssues = async(req, res) => {
    try {
        const issues = Issue.find({}).populate("repository");

        if(!issues){
          return res.status(404).json({message : "No issue found"});
        }
        return res.status(200).json(issues);
    } catch (err) {
       console.error(chalk.red("Error during fetching issues :", err.message));
          res.status(500).json({ message: "Server error" });
    }
};
const getIssueById = async(req, res) => {
    const {id} = req.params;
    try {

      const issue = Issue.findById(id);
      if(!issue){
        return res.status(404).json({message : "Issue not found"})
      }
      return res.status(200).json({message : "Issue found successfully" , issue})

    } catch (err) {
      console.error(chalk.red("Error during fetching issue :", err.message));
          res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
  createIssue,

  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
