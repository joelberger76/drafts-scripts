//Checklist Template

//Create template
const template = `## 
- [ ] `;

//Create the draft
var d = Draft.create();
d.content = template;
d.update()

//Load in editor and focus for editing
editor.load(d);
//Set cursor to first field for quick entry
editor.setSelectedRange(3,0);
editor.activate();