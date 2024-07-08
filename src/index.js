#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function createDirectoryContents(templatePath, newProjectPath) {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach((file) => {
    const origFilePath = path.join(templatePath, file);
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, "utf8");

      const writePath = path.join(newProjectPath, file);
      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      fs.mkdirSync(path.join(newProjectPath, file));
      createDirectoryContents(
        path.join(templatePath, file),
        path.join(newProjectPath, file)
      );
    }
  });
}

function init() {
  rl.question("Project name: ", (projectName) => {
    const currentPath = process.cwd();
    const newProjectPath = path.join(currentPath, projectName);
    const templatePath = path.join(__dirname, "template");

    if (!fs.existsSync(newProjectPath)) {
      fs.mkdirSync(newProjectPath);
    }

    createDirectoryContents(templatePath, newProjectPath);
    console.log(`Project ${projectName} has been created.`);
    rl.close();
  });
}

init();
