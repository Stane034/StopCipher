const fs = require('fs');
const path = require('path');

const hexToSearch = ["\x50\x65\x72\x66\x6f\x72\x6d\x48\x74\x74\x70\x52\x65\x71\x75\x65\x73\x74", "\x61\x73\x73\x65\x72\x74", "\x6c\x6f\x61\x64"];
const stringsToSearch = ["/v2_/stage"]

function readFilesInDirectory(directoryPath) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directoryPath, file);

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    return;
                }

                if (stats.isDirectory()) {
                    readFilesInDirectory(filePath);
                } else {
                    if (isLuaFile(file)) {
                        fs.readFile(filePath, 'utf8', (err, data) => {
                            if (err) {
                                return;
                            }

                            if (containsHex(data) != 0) { 
                               console.log(`Backdoor found in file : ${filePath}`);
                            }
                            if (containStrings(data) != 0) { 
                                console.log(`Backdoor found in file : ${filePath}`);
                             }
                        });
                    }
                }
            });
        });
    });
}

function isLuaFile(fileName) {
    return fileName.endsWith('.lua');
}

function containsHex(data) {
    let logger = 0    
    for ( let i = 0; i < hexToSearch.length; i++) { 
        let rezultat = data.includes(textToHexWithPrefix(hexToSearch[i]))
        if (rezultat == true) { 
            logger++
        }
    }
    return logger;
}

function containStrings(data) { 
    let logger = 0    
    for ( let i = 0; i < stringsToSearch.length; i++) { 
        let rezultat = data.includes(stringsToSearch[i])
        if (rezultat == true) { 
            logger++
        }
    }
    return logger;
}



function textToHexWithPrefix(text) {
    let hex = '';
    for (let i = 0; i < text.length; i++) {
        hex += '\\x' + text.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hex;
}

const currentDirectory = process.cwd();

readFilesInDirectory(currentDirectory);
