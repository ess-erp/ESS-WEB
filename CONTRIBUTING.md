# Contributing to ESS-WEB

## 🌿 Branching Strategy

We use a **Git Flow** workflow:

### Branches:
- **`main`** - Production code (deploys to https://erp.ess.edu.ph)
- **`develop`** - Development/staging code (deploys to staging ECS)
- **`feature/*`** - New features (e.g., `feature/payroll-module`)
- **`bugfix/*`** - Bug fixes (e.g., `bugfix/login-error`)
- **`hotfix/*`** - Urgent production fixes

---

## 🔄 Workflow

### 1. Creating a New Feature

```bash
# Start from develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... code, code, code ...

# Commit your work
git add .
git commit -m "Add: description of your feature"

# Push to GitHub
git push origin feature/your-feature-name
```

### 2. Create Pull Request

1. Go to https://github.com/ess-erp/ESS-WEB/pulls
2. Click **New pull request**
3. Base: `develop` ← Compare: `feature/your-feature-name`
4. Add description of changes
5. Request reviews from team members
6. Wait for approval

### 3. After PR Approved

```bash
# Merge to develop (via GitHub UI or CLI)
# This will auto-deploy to STAGING

# Test on staging environment
# If everything works, create PR from develop → main
```

### 4. Deploy to Production

```bash
# Create PR: develop → main
# After approval and merge, it auto-deploys to PRODUCTION
```

---

## 📝 Commit Message Convention

Use clear, descriptive commit messages:

### Format:
```
<Type>: <Short description>

<Optional detailed description>
```

### Types:
- **Add:** New feature or functionality
- **Fix:** Bug fix
- **Update:** Changes to existing features
- **Remove:** Deleted code or features
- **Refactor:** Code restructuring without behavior change
- **Docs:** Documentation changes
- **Style:** Formatting, missing semicolons, etc.
- **Test:** Adding or updating tests
- **Chore:** Build tasks, dependencies, etc.

### Examples:
```bash
git commit -m "Add: payroll calculation module"
git commit -m "Fix: login redirect loop on expired session"
git commit -m "Update: student enrollment form validation"
git commit -m "Refactor: extract payment processing to separate service"
git commit -m "Docs: add API documentation for attendance module"
```

---

## 🧪 Testing Before Commit

Always test your changes locally:

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run development server
npm run dev

# 3. Test in browser
# Open http://localhost:5173

# 4. Build for production (ensure no errors)
npm run build

# 5. Preview production build
npm run preview
```

---

## 🚀 Deployment Process

### Automatic Deployments:

| Branch | Environment | URL | Trigger |
|--------|-------------|-----|---------|
| `main` | Production | https://erp.ess.edu.ph | Push or merge to `main` |
| `develop` | Staging | http://[ECS-IP] | Push or merge to `develop` |

### Manual Deployments:

1. Go to https://github.com/ess-erp/ESS-WEB/actions
2. Select workflow (Production or Staging)
3. Click **Run workflow**
4. Choose branch
5. Click **Run workflow**

---

## 📋 Pull Request Checklist

Before creating a PR, ensure:

- [ ] Code follows project conventions (see `code-patterns.md`)
- [ ] No console.log() statements (use proper logging)
- [ ] No hardcoded values (use environment variables)
- [ ] Tested locally (npm run dev)
- [ ] Production build works (npm run build)
- [ ] No new ESLint errors
- [ ] Updated documentation if needed
- [ ] Commit messages are clear and descriptive

---

## 🛠️ Development Setup

### Prerequisites:
- Node.js 20.x
- npm 9.x or higher
- Git

### Initial Setup:

```bash
# Clone repository
git clone https://github.com/ess-erp/ESS-WEB.git
cd ESS-WEB

# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables
# (Get .env from team lead)

# Start development server
npm run dev
```

### Available Scripts:

```bash
npm run dev        # Start dev server (localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## 🐛 Reporting Bugs

Found a bug? Create an issue:

1. Go to https://github.com/ess-erp/ESS-WEB/issues
2. Click **New issue**
3. Use this template:

```
**Bug Description:**
Clear description of what's wrong

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
If applicable

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- URL: [e.g., https://erp.ess.edu.ph/hr/payroll]
```

---

## 💡 Feature Requests

Have an idea? Create an issue with the **enhancement** label:

```
**Feature Description:**
What feature do you want?

**Use Case:**
Why is this needed? Who will use it?

**Proposed Solution:**
How do you think it should work?

**Alternatives Considered:**
Other ways to solve this
```

---

## 🤝 Code Review Guidelines

### As a Reviewer:
- Be constructive and respectful
- Test the changes locally if possible
- Check for security issues
- Verify follows project patterns
- Approve only if confident in the changes

### As a Developer:
- Respond to feedback promptly
- Don't take feedback personally
- Explain your decisions if questioned
- Make requested changes or discuss alternatives

---

## 📚 Project Structure

```
ESS-WEB/
├── .github/              # GitHub Actions workflows
├── aws-deployment/       # AWS deployment configs
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── states/         # Redux state management
│   ├── routes/         # React Router routes
│   ├── services/       # API services
│   └── utils/          # Utility functions
├── .env                # Environment variables (NOT in git)
├── .dockerignore       # Docker ignore rules
├── package.json        # Dependencies
└── vite.config.js      # Vite configuration
```

---

## 🔒 Security

**Never commit:**
- `.env` files
- AWS credentials
- API keys or tokens
- Database passwords
- Private keys

**If you accidentally commit secrets:**
1. Rotate/revoke the credential immediately
2. Remove from git history: `git filter-branch` or BFG Repo-Cleaner
3. Force push (if repository is private)
4. Notify team lead

---

## 📞 Getting Help

**Stuck? Ask for help:**
- Create a GitHub issue
- Ask in team chat
- Review project documentation
- Check existing PRs for examples

**Useful Resources:**
- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vitejs.dev)

---

## 🎯 Code Quality

### Follow These Principles:
- **DRY** (Don't Repeat Yourself)
- **KISS** (Keep It Simple, Stupid)
- **YAGNI** (You Aren't Gonna Need It)
- **SOLID** principles

### Best Practices:
- Write self-documenting code
- Use meaningful variable names
- Keep functions small and focused
- Comment complex logic
- Handle errors gracefully
- Validate user input
- Use TypeScript types (if available)

---

Thank you for contributing to ESS-WEB! 🚀
