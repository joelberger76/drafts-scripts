// Convert Notes to Markdown Table

const lineLength = 75;
const topicLength = 24;
const notesLength = lineLength - topicLength;
const indentSize = 3;

let f = () => {
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
   let mdOutput = "\n" + "|Topic".padEnd(topicLength+1) +
                  "|Notes".padEnd(notesLength+1) + "|\n" + 
                  "|:--".padEnd(topicLength+1, '-') +
                  "|:--".padEnd(notesLength+1, '-') + "|";
   let trailingBRsRegex = new RegExp("(<br>)+$");
   let indentRegex = new RegExp(" {" + indentSize + "}", "g");
   topicArray.forEach(t => {
      // Combine notes lines with <BR>, strip trailing <BR>s from the end of
      // the string due to whitespace, replace indents with 2 emspaces
      mdOutput = mdOutput + "\n|" + t.name.padEnd(topicLength) + "|" + 
                 t.notes.join('<br>').replace(trailingBRsRegex, '')
                                     .replace(indentRegex, "&emsp;&emsp;").padEnd(notesLength) + 
                                     "|";
   });
   
   //HTML comment current selection, and add new markdown table below
   let newSelection = "<!--\n" + sel + "\n-->\n" + mdOutput;
   editor.setSelectedText(newSelection);
   editor.setSelectedRange(selRange[0] + newSelection.length, 0);

	return true;
}

if (!f()) { context.cancel(); }