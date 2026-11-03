---
inclusion: auto
---

# ERP 2026 - ESS Web Application - Project Context

## Project Overview
This is an **Enterprise Resource Planning (ERP)** system for educational institutions, specifically the **Employee Self-Service (ESS)** web application built with React + Vite.

### Technology Stack
- **Frontend**: React 18, Vite
- **State Management**: Redux (traditional action/reducer pattern, NOT Redux Toolkit slices)
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **UI Framework**: Tailwind CSS, Headless UI
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons, Heroicons
- **Date Handling**: Custom formatters in `GlobalFunction/FormatDate.js`

### Project Structure
```
src/
├── components/           # Reusable components organized by module
│   ├── HrComponents/    # Human Resources components
│   ├── AdmissionComponents/
│   ├── AccountingComponents/
│   ├── ButtonsComponents/  # Reusable form inputs and buttons
│   └── SharedComponents/   # Cross-module shared components
├── pages/               # Page-level components
│   ├── HumanResources/
│   ├── Admission/
│   └── ...
├── states/              # Redux state management
│   ├── HumanResourcesState/
│   │   ├── Action.js    # Action creators and async thunks
│   │   ├── ActionType.js # Action type constants
│   │   └── Reducer.js   # Reducer functions
│   └── ...
├── routes/              # Route configurations
├── services/            # API services and utilities
└── GlobalFunction/      # Global utilities and helpers
```

### Redux Pattern (IMPORTANT)
This project uses **traditional Redux** pattern, NOT Redux Toolkit slices:
- Action types are string constants in `ActionType.js`
- Actions are plain functions returning action objects
- Async operations use custom thunk functions with `dispatch`
- Reducers use switch statements
- State shape: `{ loading, data, error }` pattern

### API Configuration
- Base URL: Configured in `.env` as `VITE_BASE_URL`
- Authentication: JWT Bearer token from `tokenServices`
- All API calls require `Authorization` header

### Common Patterns
1. **Date Formatting**: Use `getFormatDate()` and `getDateInputValue()` from `GlobalFunction/FormatDate.js`
2. **Toasts**: Use `CustomToast()` for notifications (integrated with GlobalToastHandler)
3. **Modals**: Use `ModalComponent` wrapper or custom modals with Framer Motion
4. **Forms**: Use React Hook Form with custom input components from `ButtonsComponents/`
5. **Tables**: DataTable components with pagination, search, and filtering
6. **Breadcrumbs**: Standard pattern in page components using `Breadcrumb` component

### Key Modules
- **Human Resources (HRD)**: Employee management, hiring, payroll, DTR, leave management
- **Admission**: Student applications, enrollment, exam scheduling
- **Accounting**: COA, journal entries, financial reports, fee assessment
- **SRU**: Student records, sections, grade reports
- **Cashier**: Payment processing, transaction history
- **Academic**: Faculty loads, curriculum, subject scheduling
- **Purchasing**: Request forms, purchase orders, suppliers

### User Roles
The system supports multiple role-based access:
- Role 1: Admission
- Role 2: CFW (Center for Wellness)
- Role 3: Cashier
- Role 5: SRU (Student Records Unit)
- Role 6: Academic Staff
- Role 7-10: HR Department (various levels)
- Role 11: SAC (Student Affairs Coordinator)
- Role 12: Assistant Principal
- Role 13: Principal
- Role 14-15: Teacher
- Role 16: Student
- Role 17: Parent
- Role 18: Accounting
- Role 19: Purchasing

### Design System
- **Primary Color**: Green (#00c853, #00b0ff gradient)
- **Secondary Color**: Blue
- **Alert Colors**: Yellow (warnings), Red (errors), Green (success)
- **Typography**: Font bold for headers, regular for content
- **Spacing**: Consistent use of Tailwind spacing utilities
- **Shadows**: Use shadow-md, shadow-lg for elevation
- **Borders**: Rounded corners (rounded-lg, rounded-xl)

### Development Notes
- Build command: `npm run build`
- Dev server: `npm run dev`
- Always run build to verify changes before committing
- The project uses PowerShell on Windows
