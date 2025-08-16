const fs = require("fs");
const path = require('path');
const chalk = require('chalk');

const {promisify} = require('util');
const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revertRepo(commitId) {
  const repoPath = path.resolve(process.cwd() , '.verzio');
  const commitsPath = path.join(repoPath , 'commits');

  try {
    const commitDir = path.join(commitsPath , commitId);
    const files = await readdir(commitDir);

    const parentDir = path.resolve(repoPath , '..');

    for(const file of files){
        await copyFile(path.join(commitDir , file) , path.join(parentDir , file));
    }
    console.log(chalk.green.bold(`Commit ${commitId} reverted successfully`));
  } catch (error) {
    console.error(chalk.red.bold('Unable to revert : ', commitId , error));
  }
}
module.exports = {revertRepo};