import users from './data/users.js';
import User from './models/userModel.js';
import connectDB from './config/db.js';

process.loadEnvFile();      //To load .env

connectDB();

async function importData(){
    try{
        await User.deleteMany();
        await User.insertMany(users);

        console.log("User Data Loaded!".green.inverse);
        process.exit();
    }
    catch(err){
        console.log(err.message);
        process.exit(1);
    }
}

async function destroyData(){
    try{
        await User.deleteMany();
        console.log("User Data Cleared!".red.inverse);
        process.exit();
    }
    catch(err){
        console.log(err.message);
        process.exit(1);
    }
}

if(process.argv[2] == '-D'){
    destroyData();  // Clears users only
} else{
    importData();   // Imports users only
}
