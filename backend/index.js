const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');

const {initRepo} = require('./controllers/init')
const {addRepo} = require('./controllers/add')
const {pullRepo} = require('./controllers/pull');
const {commitRepo} = require('./controllers/commit');
const {pushRepo} = require('./controllers/push');
const {revertRepo} = require('./controllers/revert');

yargs(hideBin(process.argv))
.command('init' ,'Initialise a new repository' , {} , initRepo)
.command('add <file>' ,'Add a file to repository' , (yargs)=>{yargs.positional("file" , {
    describe : "File sent to staging area",
    type : 'string'
})} , (argv)=>{addRepo(argv.file)})
.command('commit <message>' ,'Commit the staged file', (yargs)=>{
    yargs.positional("message", {
        describe : "Commit message",
        type : 'string'
    })
} , (argv)=>{commitRepo(argv.message)})
.command('push' ,'Push commits to S3' , {} , pushRepo)
.command('pull' ,'Pull commits from S3' , {} , pullRepo)
.command('revert <commitId> ' ,'Revert to the commit id ' , (yargs)=>{
    yargs.positional("commitId" , {
        describe : "Commit ID to revert the repo",
        type : 'string'
    })
} , revertRepo)
.demandCommand(1 , "You need atleast one command").help().argv;
