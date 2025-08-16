const fs = require('fs').promises;
const path =  require('path');
const {s3 , S3_BUCKET} = require('../config/aws-config');
const chalk = require('chalk');
const { log } = require('console');

async function pushRepo() {
   const repoPath = path.resolve(process.cwd() , '.verzio');
   const commitsPath = path.join(repoPath , 'commits');
   try {
        const commitDirs = await fs.readdir(commitsPath);

        for(const commitDir of commitDirs){
            const commitPath = path.join(commitsPath , commitDir);
            const files = await fs.readdir(commitPath);
            for(const file of files){
                const filePath = path.join(commitPath , file);
                const fileContent = await fs.readFile(filePath);

                const params = {
                    Bucket : S3_BUCKET,
                    Key : `commits/${commitDir}/${file}`,
                    Body : fileContent
                };
                await s3.upload(params).promise();
            }
        }
        console.log(chalk.green.bold("All commits pushed to S3"));
   } catch (error) {
        console.error(chalk.redBright.bold("Error while pushing to S3", error));
   }
    
}
module.exports = { pushRepo};