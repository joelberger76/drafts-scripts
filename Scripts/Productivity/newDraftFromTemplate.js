// New draft from template
// Select and process mustache templates into new drafts from drafts tagged "template"

/*
TODO
- [ ] Align text prompt field labels
- [ ] Add formats to [[date|{weekday}]] dates?
*/

require("Library/luxon.min.js");
var DateTime = luxon.DateTime;
var Info = luxon.Info;

// Create temp workspace to query drafts
let workspace = Workspace.create();
if (!workspace) {
   context.fail();
}
workspace.tagFilter = "template";
workspace.setAllSort("name", false, true);
// Get list of drafts in workspace
let drafts = workspace.query("all");

// Check if we found any valid templates
if (drafts.length == 0) {
   alert("No templates found. To make templates available to this action, create a draft with the template content and assign it the tag \"template\".");
   context.fail();
}

// Prompt to select
let p = Prompt.create();
p.title = "New Draft from Template";

let ix = 0
for (let dr of drafts) {
   p.addButton(dr.title, ix);
   ix++;
}

if (!p.show()) {
   context.fail();
}

// Get the selected template draft
let selectedIndex = p.buttonPressed;
let template = drafts[selectedIndex];
let content = template.content;

// Remove first line of template
let lines = content.split('\n');
if (lines.length > 0) {
   lines.shift();
   content = lines.join('\n').replace(/^\s+/, "");
}

// Replace weekday placeholders with ISO 8601 dates
let weekdayRegex = new RegExp("\\[\\[\\s*date\\s*\\|\\s*(\\w+)\\s*\\]\\]", "gi");
let weekdayMatches = content.matchAll(weekdayRegex);
let weekdayPlaceholders = [];
for (const weekday of weekdayMatches) {
   if (!weekdayPlaceholders.includes(weekday[0])) {
      weekdayPlaceholders.push(weekday[0]);
      let calcDate = getNextWeekdayDate(weekday[1]);
      content = content.replaceAll(weekday[0], calcDate);
   }
}

// Populate placeholders with user input
let pr = Prompt.create();
pr.title = "Populate Placeholders";
pr.addButton("OK");

let variableRegex = new RegExp("{{\\s*((?!.*date.*)\\S+)\\s*}}", "gi");
let variableMatches = content.matchAll(variableRegex);
let mustacheVarCount = 0;
for (const mustacheVar of variableMatches) {
   pr.addTextField(mustacheVar[1], mustacheVar[1], "", {
      autocapitalization: "words"
   });
   mustacheVarCount++;
}

if (mustacheVarCount) {
   if (!pr.show()) {
      context.fail();
   }
}

// Create JSON object of template fields and values
let values = {};
for (key in pr.fieldValues) {
   values[key] = pr.fieldValues[key];
}

// Create new draft and assign tags
let d = Draft.create();
for (let tag of template.tags) {
   if (tag != "template") {
      d.addTag(tag);
   }
}

// Process Mustache template
content = draft.processMustacheTemplate("text", content, values);
d.content = draft.processTemplate(content);
d.update()
editor.load(d)
editor.activate();

// Look for <|> to set cursor location
let loc = d.content.search("<|>");
if (loc != -1) {
   editor.setText(editor.getText().replace("<|>", ""));
   editor.setSelectedRange(loc, 0);
}

/******************* Functions *******************/
function getNextWeekdayDate(weekday) {
   const weekdayNum = Info.weekdays().indexOf(weekday.charAt(0).toUpperCase() +
                                              weekday.slice(1).toLowerCase())+1;
   let offset = 0;
   if (weekdayNum) {
      const today = DateTime.now().toISODate();
      if (DateTime.now().weekday > weekdayNum) {
         offset = 7;
      }
   }
   else {
       console.log("Invalid weekday provided: " + weekday);
       context.fail();
       return 0;
   }
   return DateTime.fromObject({ weekday: weekdayNum }).plus({ days: offset }).toISODate();
}