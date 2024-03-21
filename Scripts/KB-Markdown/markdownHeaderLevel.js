// Increase Markdown header level current line
// Based on https://directory.getdrafts.com/a/1CD

const [lnSt, lnLen] = editor.getSelectedLineRange();
let ln = editor.getTextInRange(lnSt, lnLen);
const [selSt, selLen] = editor.getSelectedRange();
let prefix = "#";

if (ln.startsWith("###")) {
	// max header level, clear header status
	let adj = 3;
	ln = ln.substring(3);
	while (ln.startsWith(" ")) {
		ln = ln.substring(1);
		adj++;
	}
	editor.setTextInRange(lnSt, lnLen, ln);
	editor.setSelectedRange(selSt - adj, selLen);
}
else {
	// increase level
	if (ln.length == 0 || (ln && ln[0] != " " && ln[0] != "#")) {
  		prefix = "# ";
	}
	editor.setTextInRange(lnSt, 0, prefix);
	editor.setSelectedRange(selSt + prefix.length, selLen);
}

