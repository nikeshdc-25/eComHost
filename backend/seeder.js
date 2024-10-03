import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import connectDB from './config/db.js';
import colors from "colors";

process.loadEnvFile();      //To load .env

connectDB();

async function importData(){
 try{
    await User.deleteMany();
    await Product.deleteMany();

    let newusers = await User.insertMany(users);
    await Product.insertMany(products.map((product)=>{
        return {
            ...product,
            user: newusers[0]._id,
        };
    })
);
    console.log("Data Loaded!".green.inverse);
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
        await Product.deleteMany();
        console.log("Data Cleared!".red.inverse);
        process.exit();
    }
    catch(err){
        console.log(err.message);
        process.exit(1);
    }
}

if(process.argv[2] == '-D'){
    destroyData();
} else{
    importData();
}