const path = require("path");
const { execSync } = require("child_process");

const files = ["0_guidelines.md", "1_set-up-workstation.md", "2_architecture.md", "3_deployment.md", "4_faq.md", "5_backlog.md"];

const absolutePath = (f) => path.resolve(process.cwd(), f);

// Create and insert TOC in each files with TOC comments
for (const file of files) {
  const command = `markdown-toc -i ${absolutePath(file)}`;
  console.log("Executing: " + command);
  execSync(command, { shell: "/bin/bash" });
}

console.log("Done !");
