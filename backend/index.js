const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');
const chalk = require('chalk');
const {initRepo} = require('./controllers/init')
const {addRepo} = require('./controllers/add')
const {pullRepo} = require('./controllers/pull');
const {commitRepo} = require('./controllers/commit');
const {pushRepo} = require('./controllers/push');
const {revertRepo} = require('./controllers/revert');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const {Server} = require("socket.io");
const mainRouter = require('./routes/main.router');


dotenv.config();

yargs(hideBin(process.argv))
.command('start' ,'Starts a new Server' , {} , startServer)
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
.command('revert <commitId>' ,'Revert to the commit id ' , (yargs)=>{
    yargs.positional("commitId" , {
        describe : "Commit ID to revert the repo",
        type : 'string'
    })
} , (argv)=>{ revertRepo(argv.commitId)})
.demandCommand(1 , "You need atleast one command").help().argv;



async function startServer(){
   const app = express();
   const port = process.env.PORT || 3000;
   
   app.use(bodyParser.json());
   app.use(express.json());

   const mongoURI = process.env.MONGO_URL;
   await mongoose.connect(mongoURI)
   .then(()=>{console.log(chalk.green.bold('Db connected successfully!'));})
   .catch((e)=>console.log(chalk.red.bold(e)))

   app.use(cors({origin : "*"}));

    app.use( "/" , mainRouter);

   const httpServer = http.createServer(app);
   const io = new Server(httpServer , {
    cors : {
        origin : '*',
        methods : ['GET' , 'POST' ]
    }
   });

   let user = 'test';

   io.on("connection" , (socket)=>{
        socket.on("joinRoom" , (userID)=>{
            user = userID;
            console.log(chalk.red.bold('-------------'));
            console.log(chalk.red.bold(user));
            console.log(chalk.red.bold('-------------'));
            socket.join(userID);
        });
   })

   const db = mongoose.connection;
        db.once('open' , async ()=>{
            console.log(chalk.red.bold('Crud operations called'));
            //crud operations
        });

        httpServer.listen(port , ()=>{
            console.log(chalk.green.bold(`Server is running on PORT ${port}`));
        })
}