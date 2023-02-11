const path = './modules/input.txt';
const fs = require('fs');
const replaceAll = require('string.prototype.replaceall');
const string = fs.readFileSync(path).toString();
console.log(JSON.stringify(string));
let newString = replaceAll(string, '\r\n', '\\n');
fs.writeFileSync(path, newString);
return "Done";