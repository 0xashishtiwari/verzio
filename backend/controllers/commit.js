const fs = require('fs').promises;
const path = require('path');
const {v4 : uuidv4}  = require('uuid');
const chalk = require('chalk');

async function commitRepo(message) {
   const repoPath = path.resolve(process.cwd() , '.verzio');
   const stagedPath = path.join(repoPath , 'staging');
   const commitPath = path.join(repoPath , 'commits');

   try {
        const commitID = uuidv4();
        const commitDir = path.join(commitPath , commitID);
        await fs.mkdir(commitDir , {recursive : true});

        const files = await fs.readdir(stagedPath);

        for(const file of files){
            await fs.copyFile(path.join(stagedPath , file) , path.join(commitDir , file));
        }
        await fs.writeFile(path.join(commitDir, 'commit.json') , JSON.stringify({message , date : new Date().toISOString()}));

        console.log(chalk.green.bold( `\n CommitID : ${commitID} created with message : ${message} \n`));
   } catch (error) {
    console.log(chalk.red.bold('Error commiting files' , error));
   }
}
module.exports =  {commitRepo};