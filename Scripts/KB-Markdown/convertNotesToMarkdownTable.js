// Convert Notes to Markdown Table
/*
TODO: 
- [ ] Size columns (max length (or max value), min X)
- [ ] Overwrite selection with new markdown table
- [ ] Set insertion point when done -OR-
- [ ] HTML inline comment notes <!-- -->
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
   let notesRegex = new RegExp("^( *)([-\*])( .*)");
   let topicArray = [];
   let topic = {
      "name": null,
      "notes": []
   };
   
   // Organize selected lines into topics and related notes
   sel.split("\n").forEach((line, index) => {
      let topicMatch = line.match(topicRegex);
      if (topicMatch) {
         // Start a new topic if this isn't the first line
         if (index) {
            topicArray.push(JSON.parse(JSON.stringify(topic)));
         }
      
         topic.name = topicMatch[1];
         topic.notes = [];
      }
      else {
         let notesMatch = line.match(notesRegex);
         if (notesMatch) {
            topic.notes.push(notesMatch[1] + "•" + notesMatch[3]);
         }
         else {
            topic.notes.push(line);
         }
      }
   });
   topicArray.push(JSON.parse(JSON.stringify(topic)));
   
   // Output each object using the Markdown table format
   let mdOutput = "|Topic|Notes|\n" + "|:--|:--|\n";
   let trailingBRsRegex = new RegExp("(<br>)+$");
   topicArray.forEach(t => {
      mdOutput = mdOutput + "|" + t.name + "|" + 
                 t.notes.join('<br>').replace(trailingBRsRegex, '') + "|\n";
   });
   alert(mdOutput);

	return true;
}

if (!f()) { context.cancel(); }