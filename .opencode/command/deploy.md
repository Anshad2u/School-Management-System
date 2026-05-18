# /deploy

Deploy the current state to production and verify.

## Usage

```
/deploy
```

## Description

Commits all changes, pushes to GitHub, waits for Vercel deployment, and verifies success.

## Process

1. `git status` — check for changes
2. `git add -A` — stage all changes
3. `git commit -m "chore: manual deployment"` — commit
4. `git push origin master` — push to trigger Vercel
5. Wait 30 seconds
6. `vercel --scope anshad2us-projects ls` — check deployment status
7. Confirm deployment is Ready at my-sms-beta.vercel.app

## Examples

```
/deploy
```
