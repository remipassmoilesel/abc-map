const path = require("path");
const { execSync } = require("child_process");
const fs = require("fs");

const files = fs.readdirSync(process.cwd()).filter((f) => f.toLocaleLowerCase().endsWith(".md"));

const absolutePath = (f) => path.resolve(process.cwd(), f);

// Create and insert TOC in each files with TOC comments
for (const file of files) {
  const command = `markdown-toc -i ${absolutePath(file)}`;
  console.log("Executing: " + command);
  execSync(command, { shell: "/bin/bash" });
}

console.log("Done !");
