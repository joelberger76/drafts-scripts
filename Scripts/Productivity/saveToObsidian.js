// saveToObsidian.js
// Save Draft to Obsidian with Date YAML
// TODO: None

const baseURL = "obsidian://new";
let vaultName = getObsidianVault();

const specialCharRegex = new RegExp("[:\\/]", "g");
const dateRegex = new RegExp("\\d{4}-\\d{2}-\\d{2}$");
let obsidianFilename = draft.displayTitle.replace(specialCharRegex, "-");
let content = draft.content;

// Populate frontmatter
let datestamp = obsidianFilename.match(dateRegex);
if (datestamp || draft.tags.length) {
   let frontmatter = "---\n";

   if (datestamp) {
      frontmatter += "date: " + datestamp + "\n";
   }

   if (draft.tags.length) {
      frontmatter += "tags: " + draft.tags.toString().replace(",", ", ") + "\n";
   }

   frontmatter += "---\n\n";
   content = frontmatter + content;
}

let cb = CallbackURL.create();
cb.baseURL = baseURL;
cb.addParameter("vault", vaultName);
cb.addParameter("name", obsidianFilename);
cb.addParameter("content", content);
cb.waitForResponse = false;
let success = cb.open();

if (success) {
   console.log("Draft successfully saved to Obsidian");
}
else {
   console.log("Save to Obsidian failed");
   context.fail();
}

// Get Obsidian Vault
// Returns: Obsidian Vault Name
function getObsidianVault() {
   let credential = Credential.create("Obsidian Vault", "Obsidian Vault");
   credential.addTextField("obsidianVault", "Obsidian Vault");
   credential.authorize();

   return credential.getValue("obsidianVault");
}