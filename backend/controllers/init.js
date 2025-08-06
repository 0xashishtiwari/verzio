const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk') // for the colored output in terminal


async function initRepo(){
    const repoPath = path.resolve(process.cwd() , '.verzio');
    const commitsPath = path.join(repoPath , "commits")

    try {
       await fs.mkdir(repoPath , {recursive : true});
       await fs.mkdir(commitsPath , {recursive : true});
       await fs.writeFile(path.join(repoPath,'config.json'), JSON.stringify({bucket : process.env.S3_BUCKET}))
       console.log(chalk.green.bold('\n  Repository initialized successfully!\n'));
    } catch (error) {
        console.error(
  chalk.red.bold('\n Error initializing repository:\n'),
  chalk.red(error.stack || error.message || error)
);
    }

}
 module.exports = {initRepo};