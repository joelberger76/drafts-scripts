// Convert Notes to Markdown Table
/*
TODO: 
- [ ] Size columns (max length (or max value), min X)
- [ ] Deal with blank lines between heading sections
- [ ] Overwrite selection with new markdown table
- [ ] Set insertion point when done
*/

let f = () => {
// Apply Markdown bold to selection, or insert ** if no selection
   var sel = editor.getSelectedText();
   var selRange = editor.getSelectedRange();

   if (!sel.startsWith("#")) {
      alert("ERROR: The selection must start with a Markdown header.");
      return false;
   }

   let topicRegex = new RegExp("^#+ (.*)");
   let notesRegex = new RegExp("^( *)([-,\*])( .*)");
   let topicArray = [];
   let topic = {
      "name": null,
      "notes": []
   };
   
   // Organize selected lines into topics and related notes
   let firstTopic = true;
   sel.split("\n").forEach(line => {
      let topicMatch = line.match(topicRegex);
      if (topicMatch) {
         if (!firstTopic) {
            topicArray.push(JSON.parse(JSON.stringify(topic)));
         }
         else {
            firstTopic = false;
         }
      
         topic.name = topicMatch[1];
         topic.notes = [];
         //alert("Line: " + line + "|||Topic: " + topic.name);
      }
      else {
         let notesMatch = line.match(notesRegex);
         if (notesMatch) {
            topic.notes.push(notesMatch[1] + "•" + notesMatch[3]);
         }
         else {
            topic.notes.push(line);
         }
         //alert("Line: " + line + "|||Note: " + topic.notes[topic.notes.length-1]);
      }
   });
   topicArray.push(JSON.parse(JSON.stringify(topic)));
   
   // Output each object using the Markdown table format
   let mdOutput = "|Topic|Notes|\n" + "|:--|:--|\n";
   topicArray.forEach(t => {
      //alert("Topic: " + t.name);
      //alert("Notes: " + t.notes);
      mdOutput = mdOutput + "|" + t.name + "|";
      
      let numNotes = t.notes.length;
      t.notes.forEach((n,index) => {
         if (index != numNotes-1) {mdOutput = mdOutput + n + "<br>";}
         else {mdOutput = mdOutput + n;}
      });
      mdOutput = mdOutput + "|\n";
   });
   alert(mdOutput);

	return true;
}

if (!f()) { context.cancel(); }