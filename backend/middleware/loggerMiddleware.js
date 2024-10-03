import fs from 'fs';
import path from 'path';

function logger(req, res, next) { // used for debugging!
    let today = new Date();
    let start = Date.now();
    let formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} T ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    res.on("finish", () => {
        let end = Date.now();
        let msg = `[${formattedDate}]::${req.method} ${req.originalUrl} ${req.ip} ${end - start} ms Status:${res.statusCode}`;
        console.log(msg);
        fs.appendFileSync("./log.txt", msg + "\n");
    });
    console.log(req.method, req.url);
    next();
}

export default logger;
