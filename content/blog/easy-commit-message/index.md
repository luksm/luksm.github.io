---
title: Easy commit message
date: "2022-05-17T23:28:00.000Z"
description: "How to create commit messages from your branch name"
---

If you are following [gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) or something similar you are already naming all of your branches with a lot of the information you would need to keep track of the changes.

At my company we use JIRA to keep track of our changes, so I always include too the ticket number to the branch I'm creating, so my branches endup looking like:

```bash
git checkout feat/JIRA-0000
```

But when it was time to commit, and I wanted that same information included in my messages, I had to type it again. And there is nothing that goes against a developer than having to type things more than once.

After diving a bit into git's documentation, I found what I was looking for, a good hook that would allow me to easily move the information from my branch name into my commit messages, while allowing me to format them however I wanted.

To get the branch name we can always do something like:

```bash
$ git symbolic-ref --short HEAD
```

Using `basename` and `dirname` would allow me to split my information and format my commits as I would like them to be formatted.

Here's the complete script. It also skips all the regular "trunk" branches.

```bash
#!/bin/bash

[[ $(uname) -eq "Darwin" ]] && NL=$'\\\n' || NL="\n"

# Skip on amending messages
IS_AMEND=$(ps -ocommand= -p $PPID | grep -e '--amend');

if [ -z "$IS_AMEND" ]; then
  # Include any branches for which you wish to disable this script
  if [ -z "$BRANCHES_TO_SKIP" ]; then
    BRANCHES_TO_SKIP=(main master develop release)
  fi

  # Get the current branch name and check if it is excluded
  BRANCH_NAME=$(git symbolic-ref --short HEAD)
  BRANCH_EXCLUDED=$(printf "%s\n" "${BRANCHES_TO_SKIP[@]}" | grep -c "^$BRANCH_NAME$")

  # Trim it down to get the parts we're interested in
  TRIMMED=$(echo $BRANCH_NAME | sed -e 's:^\([^-]*-[^-]*\)-.*:\1:')

  # If it isn't excluded, preprend the trimmed branch identifier to the given message 
  if [ -n "$BRANCH_NAME" ] &&  ! [[ $BRANCH_EXCLUDED -eq 1 ]]; then

    TICKET=$(basename $TRIMMED | tr '[:lower:]' '[:upper:]')
    CHANGE=$(dirname $TRIMMED | tr '[:upper:]' '[:lower:]')

    sed -i.bak -e "1s/^/$TICKET $CHANGE: /" \
    $1
  fi
fi

```

Usage in the end, can be done though the command line or any UI. When doing

```bash
$ git commit -m 'My commit message'
```

The output will be

```
VOC-0000 feat: My commit message
```

Same thing if you are commiting from any UI.