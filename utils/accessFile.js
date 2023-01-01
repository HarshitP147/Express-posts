const fs = require("fs");

/**
 * Utility function to create a file relative to the current working directory
 * @param {string} filePath Relative path of the file
 * @param {string} fileContent Content of the file if file not exists
 * @returns Promise
 */
let accessFile = (filePath, fileContent) => {
    const fileDir = filePath.split("\\").slice(0, -1).join("\\");
    return new Promise((resolve, reject) => {
        fs.access(filePath, (err) => {
            if (err) {
                fs.mkdir(fileDir, (dirErr) => {
                    if (dirErr) {
                        reject("Directory could not be created");
                        throw dirErr;
                    }
                });
                fs.writeFile(filePath, fileContent, (fileErr) => {
                    if (fileErr) {
                        reject("File could not be created");
                        throw fileErr;
                    }
                });
                resolve("File created");
            } else {
                resolve("File exists");
            }
        });
    });
};

module.exports = accessFile;
