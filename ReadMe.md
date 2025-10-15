# Project Financial Tracker

A comprehensive web application for tracking projects, contractors, and payments with role-based permissions.

## Features

- **User Authentication**: Secure login and registration system
- **Role-Based Permissions**: Different user roles with specific capabilities
- **Project Management**: Create, view, and manage projects
- **Supplier Tracking**: Add contractors/suppliers with payment tracking
- **Payment Management**: Record payments to suppliers
- **Financial Overview**: Real-time financial summaries
- **Data Persistence**: Local storage for data persistence
- **Responsive Design**: Works on desktop and mobile devices

## User Roles & Permissions

### Admin

- Full access to all features
- User management
- Can create/delete projects and suppliers
- Can record payments

### Manager

- Create/edit/delete projects and suppliers
- Record payments
- Cannot manage users

### Accountant

- View projects and suppliers
- Record payments
- Cannot modify projects or suppliers

### Viewer

- Read-only access
- Can view projects and suppliers
- Cannot make any changes

## Default User Accounts

| Role       | Username   | Password      | Permissions                      |
| ---------- | ---------- | ------------- | -------------------------------- |
| Admin      | admin      | admin123      | Full access + user management    |
| Manager    | manager    | manager123    | Create/edit projects & suppliers |
| Accountant | accountant | accountant123 | View + record payments           |
| Viewer     | viewer     | viewer123     | Read-only access                 |

## Installation

1. Download all files and maintain the folder structure
2. Open `login.html` in a web browser
3. Use one of the default accounts or register a new user

## File Structure
