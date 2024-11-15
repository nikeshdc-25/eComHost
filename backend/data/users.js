import bcrypt from 'bcryptjs';

const users = [
    {
        "username": "Nikesh Dhakal",
        "email": "nikeshdhakal@gmail.com",
        "password": bcrypt.hashSync("userAdmin", 10),
        "primaryPhone": "9848050240",
        "isAdmin": true,
    },
]

export default users;