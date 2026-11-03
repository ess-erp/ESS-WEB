---
inclusion: manual
---

# Kiro Steering Files - How to Use

## What are Steering Files?

Steering files are markdown documents that provide context and instructions to Kiro AI. They help maintain consistency across sessions and remember project-specific patterns.

## Files in This Directory

### 1. `project-context.md` (Auto-included)
**Purpose**: Provides overall project structure, technology stack, and common patterns.

**When to reference**: Automatically included in every session to give Kiro context about:
- Technology stack (React, Redux, Tailwind CSS)
- Project structure and organization
- Redux patterns (traditional, not Redux Toolkit)
- Common coding conventions
- API configuration
- Design system

**Update when**:
- Adding new major technologies
- Changing project structure
- Updating coding standards
- Modifying design system

### 2. `session-changelog.md` (Auto-included)
**Purpose**: Tracks recent development work and feature implementations.

**When to reference**: Automatically included to help Kiro understand:
- Recent feature implementations
- Component changes and additions
- Redux state updates
- API endpoints added
- Known issues or TODOs

**Update when**:
- Completing significant features
- Adding new components
- Modifying existing functionality
- Discovering bugs or issues
- Planning future work

### 3. `README.md` (This file - Manual inclusion)
**Purpose**: Documentation on how to use and maintain steering files.

**When to reference**: Use `#steering/README.md` in chat to get help on steering file management.

## How to Update Steering Files

### Quick Update Command
You can ask Kiro to update the changelog:
```
"Update the session changelog with the work we just completed"
```

### Manual Updates
1. Open the appropriate steering file
2. Add your changes following the existing format
3. Keep entries chronological (newest at top)
4. Be specific about file paths and component names
5. Include technical details (props, state, API endpoints)

## Best Practices

### DO ✅
- Update changelog after completing major features
- Be specific about file paths and component names
- Include code patterns and conventions
- Document API endpoints and payloads
- Note any deviations from standard patterns
- Keep entries concise but informative

### DON'T ❌
- Include sensitive information (API keys, passwords)
- Duplicate information across multiple files
- Write extremely long entries (break into sections)
- Forget to update dates
- Remove old entries (archive them instead)

## File Inclusion Types

### `inclusion: auto`
File is automatically included in every Kiro session. Use for:
- Project context
- Recent work history
- Common patterns

### `inclusion: manual`
File is only included when explicitly referenced with `#steering/filename.md`. Use for:
- Documentation
- Archived changelogs
- Specialized workflows

### `inclusion: fileMatch`
File is included when specific files are read. Use for:
- Module-specific guidelines
- Component-specific patterns

## Example Usage in Chat

```
# Reference a steering file manually
"Check the session changelog for recent HR work"

# Ask Kiro to update changelog
"Update the session changelog with the employee data management component we just created"

# Ask Kiro to check context
"What's our Redux pattern according to the project context?"
```

## Archiving Old Changelog Entries

When `session-changelog.md` gets too large (over 500 lines), create an archive:

1. Create `session-changelog-archive-2024.md`
2. Move older entries there
3. Change inclusion to `manual`
4. Keep most recent 2-3 months in main changelog

## Maintenance Schedule

- **After each major feature**: Update changelog
- **Monthly**: Review and organize changelog entries
- **Quarterly**: Archive old entries
- **When onboarding new patterns**: Update project-context.md

---

## Quick Reference

| File | Inclusion | Purpose | Update Frequency |
|------|-----------|---------|------------------|
| project-context.md | auto | Project setup & patterns | When architecture changes |
| session-changelog.md | auto | Recent work history | After each feature |
| README.md | manual | Steering docs | When system changes |

---

**Created**: 2024-08-25
**Maintained by**: Development Team + Kiro AI
