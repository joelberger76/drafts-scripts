// Outdent

// character string used for indent
let indent = "    ";
if (draft.languageGrammar == "Taskpaper") {
	indent = "\t";
}
else if (draft.languageGrammar == "GitHub Markdown") {
   indent = "   ";
}

// grab ranges and text
let [selStart, selLen] = editor.getSelectedRange();
let [lnStart, lnLen] = editor.getSelectedLineRange();
let lnText = editor.getTextInRange(lnStart, lnLen);

// loop over lines and remove level of indents
let updatedLines = [];
let outdentCt = 0;
let startAdjust = 0;
let isFirst = true;

let lines = lnText.split("\n");
for (let line of lines) {
	if (line.startsWith(indent)) {
   		updatedLines.push(line.substr(indent.length, line.length-indent.length));
   		if (!isFirst) {
      		outdentCt++;
    	}
    	else {
    		if (selStart > lnStart) {
	      		startAdjust = indent.length;
	      	}
    	}
  }
  else { // not indented
    updatedLines.push(line);
  }
  isFirst = false;
}

// set text
editor.setTextInRange(lnStart, lnLen, updatedLines.join("\n"));

// update selection
let newStart = selStart - startAdjust;
let newLen = selLen - (indent.length * outdentCt)
editor.setSelectedRange(newStart, newLen);
