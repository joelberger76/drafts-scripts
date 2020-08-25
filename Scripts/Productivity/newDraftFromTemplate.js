// New draft from template
// Select from a list of templates in the Drafts iCloud Directory.
// Templates stored in .template files.
// Counterpart tag files named the same as template with .tag extension.
// Tags should be seperated by newlines.

/*
TODO:
- [ ] Test on Mobile
- [ ] Test with special characters
- [ ] Parameters
- [ ] Add new templates: meeting notes, memo
- [ ] Add templates to deploy script
*/

let f = () => {
   const TEMPLATE_PATH = 'Library/Templates/';
   const TEMPLATE_FILE_EXT = '.template';
   const TAG_FILE_EXT = '.tag';

   let fmCloud = FileManager.createCloud();
   let templates = [];
   let directoryListing = fmCloud.listContents(TEMPLATE_PATH);

   let regex = new RegExp(escapeRegExp(TEMPLATE_PATH) + "(.+)" +
                          escapeRegExp(TEMPLATE_FILE_EXT) + "$");   
   directoryListing.forEach(filename => {
      let match = filename.match(regex);
      if (match) {
         templates.push(match[1]);
      }
   });
   
   templates.sort();
   
   // Check if we found any valid templates
   if (templates.length == 0) {
      alert("No templates found. To make templates available to this action, place " + TEMPLATE_FILE_EXT + " files in the Drafts iCloud template directory");
      return false;
   }
   
   // Prompt to select
   let p = Prompt.create();
   p.title = "New Draft with Template";
   p.message = "Select a template. A new draft will be created based upon the template selected.";
   templates.forEach((filename, index) => {
      p.addButton(filename, index);
   });
   
   if (!p.show()) {
      return false;
   }
   
   // Get the selected template
   let selectedIndex = p.buttonPressed;
   let template = TEMPLATE_PATH + templates[selectedIndex] + TEMPLATE_FILE_EXT;
   
   // Create new draft and assign content
   let d = Draft.create();
   d.content = d.processTemplate(fmCloud.readString(template));
   
   // Check for counterpart tag file
   let tagFile = fmCloud.readString(TEMPLATE_PATH + templates[selectedIndex] + TAG_FILE_EXT);
   if (tagFile) {
      tagFile.split("\n").forEach(tag => {
         d.addTag(tag);
      });
   }
   
   d.update();

   // Load new draft
   editor.load(d);
   editor.activate();
   return true;
}

if (!f()) {
   context.cancel();
}

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}