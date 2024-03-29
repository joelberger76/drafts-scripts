// Outdent

// character string used for indent
let indent = "    ";
if (draft.languageGrammar == "Taskpaper") {
	indent = "\t";
}
else if (draft.languageGrammar.toLowerCase().includes("markdown")) {
   indent = "   ";
}

// grab ranges and text
let [selStart, selLen] = editor.getSelectedRange()
let [lnStart, lnLen] = editor.getSelectedLineRange()
let lnText = editor.getTextInRange(lnStart, lnLen)

// loop over lines and remove level of indents
let updatedLines = []
let outdentCt = 0
let startAdjust = 0
let isFirst = true

let lines = lnText.split("\n")
for (let line of lines) {
	if (line.startsWith(indent)) {
   		updatedLines.push(line.substr(indent.length, line.length-indent.length))
   		if (!isFirst) {
      		outdentCt += indent.length
    	}
    	else {
    		if (selStart > lnStart) {
	      		startAdjust = indent.length
	      	}
    	}
  }
  else if (line.startsWith("\t")) { // also clean up other whitespace that might not match prefs
      updatedLines.push(line.substr(1, line.length-1))
   		if (!isFirst) {
      		outdentCt += 1
    	}
    	else {
    		if (selStart > lnStart) {
	      		startAdjust = 1
	      	}
    	}
  }
  else if (line.startsWith("  ")) { // also clean up other whitespace that might not match prefs
      updatedLines.push(line.substr(2, line.length-2))
   		if (!isFirst) {
      		outdentCt += 2
    	}
    	else {
    		if (selStart > lnStart) {
	      		startAdjust = 2
	      	}
    	}
  }
  else { // not indented
    updatedLines.push(line)
  }
  isFirst = false
}

// set text
editor.setTextInRange(lnStart, lnLen, updatedLines.join("\n"))

// update selection
let newStart = selStart - startAdjust
let newLen = selLen - outdentCt
editor.setSelectedRange(newStart, newLen)
