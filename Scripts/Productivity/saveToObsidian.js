// saveToObsidian.js
// Save Draft to Obsidian with Date YAML
// TODO: Add YAML Date frontmatter and Meeting Note formatting?

const baseURL = "obsidian://new";
let vaultName = getObsidianVault();

let cb = CallbackURL.create();
cb.baseURL = baseURL;
cb.addParameter( "vault", vaultName);
cb.addParameter( "name", draft.displayTitle);
cb.addParameter("content", draft.content);
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