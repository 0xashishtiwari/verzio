const fs = require("fs").promises;
const path = require("path");
const chalk = require("chalk"); // for the colored output in terminal

async function addRepo(filePath) {
  const repoPath = path.resolve(process.cwd(), ".verzio");
  const stagingPath = path.join(repoPath, "staging");

  try {
    await fs.mkdir(stagingPath, { recursive: true });
    
    const fileName = path.basename(filePath);

    await fs.copyFile(filePath, path.join(stagingPath, fileName));

    console.log(chalk.green.bold(`File ${fileName} added to the staging area`));
  } catch (error) {
    console.log(chalk.red.bold("Error adding file :", error));
  }
}
module.exports = { addRepo };
