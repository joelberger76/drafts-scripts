//Roast Coffee

var ag = ActionGroup.find("Messaging");
var keyboard = ActionGroup.find("Keyboard-Coffee Roasting");
var workspace = Workspace.find("Default");

app.applyWorkspace(workspace);
app.loadActionGroup(ag);
app.loadKeyboardActionGroup(keyboard);

editor.focusModeEnabled = true;

var action = Action.find("Roast Log Template");
app.queueAction(action, draft);

editor.activate();