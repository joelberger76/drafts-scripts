#!/bin/sh

rsync -a --exclude .git/ ~/Code/drafts-scripts/Scripts/ ~/Library/Mobile\ Documents/iCloud\~com\~agiletortoise\~Drafts5/Documents/Library/Scripts/ --delete

## ctags --excmd=number --tag-relative=no --fields=+a+m+n+S -f /Users/joel/Library/Application\ Support/BBEdit/Completion\ Data/JavaScript/drafts-scripts.tags -R /Users/joel/Code/drafts-scripts/Scripts >/dev/null 2>&1