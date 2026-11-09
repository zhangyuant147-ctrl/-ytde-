import fs from "node:fs";
// Only replace this build’s generated website output.
fs.rmSync("assets",{recursive:true,force:true});
fs.cpSync("dist/assets","assets",{recursive:true});
fs.copyFileSync("dist/index.html","index.html");
fs.copyFileSync("dist/favicon.svg","favicon.svg");
fs.writeFileSync(".nojekyll", "");
console.log("Static website synchronized to the repository root.");
