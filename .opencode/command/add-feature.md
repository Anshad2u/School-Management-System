# /add-feature

Build a new feature or page in the School Management System.

## Usage

```
/add-feature {feature_name}
```

## Description

Creates a new page/module following the feature development workflow.

## Process

1. Determine the route: `/src/app/{feature_name}/page.tsx`
2. Check if database changes are needed
3. Create the page using the page template
4. Build, commit, push, deploy
5. Verify at my-sms-beta.vercel.app/{feature_name}

## Examples

```
/add-feature attendance
/add-feature timetable
/add-feature parent-portal
```
