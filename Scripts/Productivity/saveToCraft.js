// saveToCraft.js
// Save Draft to Craft Note

const baseURL = "craftdocs://createdocument?";

let spaceID = getCraftSpaceID();
let title = draft.displayTitle;
let content = draft.processTemplate("[[body]]").split('\n');

// Discard the first line of content if it is empty
if (!content[0]) {
   content.shift();
}

// Save Draft to the Craft inbox
let success = app.openURL(baseURL + "spaceId=" + encodeURIComponent(spaceID) + "&"
                                  + "title=" + encodeURIComponent(title) + "&"
                                  + "content=" + encodeURIComponent(content.join('\n')) + "&"
                                  + "folderId=");
if (success) {
   console.log("Draft successfully saved to Craft");
}
else { 
   console.log("Save to Craft failed");
   context.fail();
}

// Get Craft Space ID
// Returns: Craft Space ID
function getCraftSpaceID() {
   let credential = Credential.create("Craft Space ID", "Craft Space ID");
   credential.addTextField("craftSpaceID", "Craft Space ID");
   credential.authorize();
   
   return credential.getValue("craftSpaceID");  
}