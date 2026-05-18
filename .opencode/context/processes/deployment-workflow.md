# Deployment Workflow

## Git + Vercel Deployment Process

Every code change must follow this workflow:

### 1. Stage and Commit
```bash
git add -A
git commit -m "type: description"
```

**Commit types**:
- `feat:` — new feature
- `fix:` — bug fix
- `refactor:` — code restructuring
- `style:` — visual/formatting changes
- `docs:` — documentation
- `chore:` — maintenance tasks

### 2. Push to GitHub
```bash
git push origin master
```

### 3. Wait for Vercel Deployment
Vercel auto-deploys on push to master. Wait 25-35 seconds.

### 4. Check Deployment Status
```bash
vercel --scope anshad2us-projects ls
```

Look for the latest deployment with status `● Ready` in Production environment.

### 5. Verify at Alias
Check the deployed site at: **my-sms-beta.vercel.app**

## Vercel Project Details

- **Project name**: my-sms
- **Project ID**: prj_FY3DSXnoSS3KId9rjCFIfT7Lo0sy
- **Org**: anshad2us-projects
- **Alias**: my-sms-beta.vercel.app
- **Framework**: Next.js
- **Node version**: 24.x

## Environment Variables on Vercel

All env vars are configured on the my-sms Vercel project:
- NEXT_PUBLIC_SUPABASE_URL (Development + Production)
- NEXT_PUBLIC_SUPABASE_ANON_KEY (Development + Production)
- SUPABASE_SERVICE_ROLE_KEY (Development + Production)

## Troubleshooting

### Build Fails
1. Run `npm run build` locally first
2. Check for TypeScript errors
3. Verify all imports resolve
4. Check for unclosed JSX tags

### Deployment Not Triggering
1. Verify push succeeded: `git log -1`
2. Check Vercel project is linked: `cat .vercel/project.json`
3. Verify project.json points to my-sms project

### Env Vars Missing on Deploy
```bash
vercel env ls  # Check current vars
vercel env add NAME environment --value "value"  # Add missing
```
