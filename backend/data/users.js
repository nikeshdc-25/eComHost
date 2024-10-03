import bcrypt from 'bcryptjs';

const users = [
    {
        "username": "Nikesh Dhakal",
        "email": "nikeshdhakal@gmail.com",
        "password": bcrypt.hashSync("userAdmin", 10),
        "isAdmin": true,
    },
    {
        "username": "John.Doe",
        "email": "johndoe@gmail.com",
        "password": bcrypt.hashSync("johnDoe", 10),
        "isAdmin": false,
    },
    {
        "username": "Jane.Doe",
        "email": "janedoe@gmail.com",
        "password": bcrypt.hashSync("janeDoe", 10),
        "isAdmin": false,
    }
]

export default users;