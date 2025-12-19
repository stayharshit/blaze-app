# Imports Directory Structure

This directory follows a clean architecture pattern with clear separation of concerns.

## Directory Structure

```
imports/
├── api/                    # API Layer - Meteor methods and publications
│   ├── methods/           # Meteor methods (server-side)
│   │   ├── index.js      # Barrel export for all methods
│   │   └── tasks.js       # Task-related methods
│   └── publications/      # Meteor publications (server-side)
│       ├── index.js       # Barrel export for all publications
│       └── tasks.js       # Task publication
│
├── db/                    # Database Layer
│   └── collections/       # MongoDB collections
│       └── TasksCollection.js
│
├── lib/                   # Shared Library Code
│   ├── constants/         # Application constants
│   │   └── tasks.js       # Task-related constants
│   ├── utils/             # Utility functions
│   │   ├── auth.js        # Authentication utilities
│   │   └── tasks.js       # Task-related utilities
│   └── validators/        # Validation functions
│       └── tasks.js       # Task validation logic
│
├── startup/               # Application startup code
│   ├── client/            # Client-side startup
│   │   └── index.js
│   └── server/            # Server-side startup
│       ├── index.js       # Barrel export
│       └── seed.js        # Database seeding
│
└── ui/                    # User Interface Layer
    ├── components/        # React components
    │   ├── PriorityBadge.jsx
    │   ├── SearchBar.jsx
    │   ├── StatsDashboard.jsx
    │   └── TaskEditor.jsx
    ├── templates/         # Blaze templates (organized by feature)
    │   ├── App/           # Main application template
    │   │   ├── App.html
    │   │   └── App.js
    │   ├── Login/         # Login template
    │   │   ├── Login.html
    │   │   └── Login.js
    │   └── Task/          # Task item template
    │       ├── Task.html
    │       └── Task.js
    └── wrappers/          # Blaze-React integration wrappers
        ├── PriorityBadgeWrapper.html
        ├── PriorityBadgeWrapper.js
        ├── SearchWrapper.html
        ├── SearchWrapper.js
        ├── StatsWrapper.html
        ├── StatsWrapper.js
        ├── TaskEditorWrapper.html
        └── TaskEditorWrapper.js
```

## Architecture Principles

1. **Separation of Concerns**: Each layer has a clear responsibility
2. **Feature-based Organization**: UI templates are organized by feature (App, Login, Task)
3. **Reusability**: Shared utilities and constants are in the `lib/` folder
4. **Scalability**: Easy to add new features by following the existing patterns
5. **Maintainability**: Clear structure makes it easy to find and modify code

## Import Patterns

- **API Layer**: `import '/imports/api/methods'` or `import '/imports/api/publications'`
- **Database**: `import { TasksCollection } from '/imports/db/collections/TasksCollection'`
- **Utilities**: `import { getUser } from '/imports/lib/utils/auth'`
- **Constants**: `import { DEFAULT_PRIORITY } from '/imports/lib/constants/tasks'`
- **Templates**: `import '/imports/ui/templates/App/App'`
- **Components**: `import SearchBar from '/imports/ui/components/SearchBar'`
