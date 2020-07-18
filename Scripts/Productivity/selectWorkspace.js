//Select Workspace

var workspaces = Workspace.getAll();

var p = Prompt.create();
p.title = "Select Workspace";
for (var ix in workspaces) {
	p.addButton(workspaces[ix].name);
}

if (p.show()) {
  app.applyWorkspace(Workspace.find(p.buttonPressed));
}
else {
  context.cancel();
}