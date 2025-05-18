## Overview

Pustak is an open-source, plugin-based life operating system designed to help users build personalised productivity dashboards. The platform emphasises modularity, extensibility, and ease of use while balancing performance and flexibility. It supports self-hosting (via Docker) and cloud deployment, with PostgreSQL as the primary data store and a JSON-based DSL for dynamic dashboard rendering.

---

## Core Components

### 1. **Host Application**

- **Language:** Node.js (TypeScript)
- **Authentication:** Delegated to SuperTokens Cloud via environment variable (`SUPERTOKENS_CORE_URL`). Can be migrated to self-hosted SuperTokens Core in the future if needed, but not expected until significant self-hosted adoption or demand arises.
- **Responsibilities:**
    - Plugin management (load, install, upgrade)
    - Hook/event dispatching
    - User authentication/session management
    - Dashboard and widget composition
    - Database migrations and schema management

### 2. **Frontend UI**

- **Framework:** React (Vite + TypeScript)
- **Features:**
    - Dashboard grid UI (drag/drop, layout persistence)
    - Plugin-rendered widgets
    - Plugin configuration interfaces
    - Auth/session management

### 3. **Database**

- - **Engine:** PostgreSQL (latest image for production)
- **Note:** Adminer will be used for local DB inspection and browsing during development
- **Structure:**
    - Core shared tables: `users`, `user_plugins`, `dashboards`, `dashboard_widgets`, `plugin_versions`
    - Plugin-defined tables: Name spaced per plugin (e.g. `weight_tracker_logs`)
    - JSONB fields for config and layout storage

### 4. **Plugins**

- **Format:** Directory-based module with manifest and lifecycle hooks
- **Key files:**
    - `plugin.json`: Name, version, widgets, migrations
    - `index.ts`: Exports `init()`, `renderWidget()`, `migrations[]`
    - `widgets/`: React/Svelte components
- **Lifecycle hooks:**
    - `init(context)`
    - `renderWidget(widgetType, config)`
    - `onSchedule`, `onEvent`, etc.

### 5. **Plugin Registry (Optional)**

- Future extension to host and distribute third-party plugins
- Authenticated publishing, semantic versioning, signature verification

---

## Self-Hosting

### Docker Compose Example:

```yaml
services:
  app:
    build: .
    ports:
      - 3000:3000
    volumes:
      - ./plugins:/app/plugins
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: pustak
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: pustak
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## Plugin Lifecycle and Versioning

- Plugin code is versioned at the instance level
- User-specific plugin activation is stored in the `user_plugins` table
- Migrations are executed per plugin version using SQL or JS scripts
- The `plugin_versions` table tracks currently installed plugin versions

---

## Data Visibility and Sharing

Pustak supports collaboration and sharing by associating visibility settings with plugin data and user dashboards. Each plugin record (e.g., a weight log or to-do item) can have one of the following visibility scopes:

- **private**: Only the owner can view
- **friends**: Visible to a user’s approved social group (future extension)
- **public**: Visible to anyone (e.g., public leaderboard or profile)

### Plugin Activation-Level Visibility

Visibility settings are managed at the plugin activation level. The `user_plugins` table should include:

```
user_id UUID REFERENCES users(id),
plugin_name TEXT NOT NULL,
version TEXT NOT NULL,
visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'friends', 'public')),
activated_at TIMESTAMP DEFAULT now(),
PRIMARY KEY (user_id, plugin_name)
```

This sets a default visibility scope for all data created under that plugin for the user.

In the future, visibility can be extended to support custom user groups (e.g., teams, cohorts). For the MVP, data privacy will be managed at the plugin activation level per user, determining whether data from that plugin is visible and to whom.

---

## Dashboard System

- Stored in `dashboards` and `dashboard_widgets` tables
- Uses JSON DSL to represent layout and widget configs
- Each widget is mapped to a plugin + widgetType
- Runtime loads widget via plugin hook: `renderWidget(widgetType, config)`

---

## Future Extensions

- Multi-user collaboration (shared dashboards, tasks)
- Plugin marketplace and publishing toolchain
- Mobile apps (via React Native or Capacitor)
- End-to-end encrypted sync across devices

---

## Repository Structure

### `pustak-core/` – Main Host Platform

```
pustak-core/
├── apps/
│   ├── web/                      # React client (Vite + TS)
│   └── server/                   # Node.js backend (TS)
├── packages/
│   ├── types/                    # Shared TS types (plugin API, user, etc.)
│   ├── plugin-api/              # Official plugin contract interface
│   └── utils/                   # Shared utilities
├── docker/
│   └── docker-compose.yml       # Self-host setup: core, db, supertokens
├── .env.example
├── README.md
└── turbo.json / nx.json         # Optional: monorepo runner config
```

### `pustak-plugins/` – First-Party Plugins

```
pustak-plugins/
├── plugins/
│   ├── weight-tracker/
│   │   ├── plugin.json
│   │   ├── index.ts
│   │   ├── migrations/
│   │   └── widgets/
│   ├── todo-tracker/
│   ├── goal-tracker/
│   └── ...
├── examples/
│   └── custom-plugin/           # Dev plugin starter template
├── test/
│   └── plugin-runtime.test.ts
├── scripts/
│   └── dev-loader.ts
├── README.md
└── plugin.schema.json           # Canonical schema for plugin.json
```

---

## Licensing

- **License:** MIT for host and core plugins
- Encourages third-party contributions and plugin development