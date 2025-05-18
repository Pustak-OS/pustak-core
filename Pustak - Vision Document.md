## Overview

Pustak is a flexible, extensible personal productivity platform designed to adapt to the unique needs of each user. It enables users to build custom dashboards using modular plugins that consolidate, track, and visualise their daily routines, goals, and metrics. By prioritising personalisation and composability, Pustak becomes not just a tool—but a dynamic operating system for life.

## Core Vision

Create a system that strikes the right balance between speed, ease of use, and flexibility:

- Helps users stay productive and focused on their daily tasks.
- Adapts to diverse workflows and personal preferences.
- Provides an ecosystem where plugins can be mixed, matched, and composed into meaningful, personalised dashboards.
- Offers developers and power-users the tools to build and publish their own plugins.
- Is **fully open source**, including both the host system and core plugins, enabling transparency, community-driven innovation, and long-term sustainability.

## Core Concepts

### 1. **Plugins**

- Self-contained modules that provide specific capabilities: e.g., weight tracking, to-do lists, goal progress, journaling, fasting logs, etc.
- Each plugin declares its own schema, dashboard widgets, and lifecycle hooks.
- Plugins can define their own versioning, migrations, and configuration UI.

### 2. **Dashboards**

- Visual canvas for users to drag-and-drop widgets exposed by their installed plugins.
- Multiple dashboards can exist (e.g., "Morning Routine", "Fitness Tracker", "Work Focus").
- Each dashboard can be personalized by layout, theme, and data preferences.

### 3. **Hook & Event System**

- Plugins can register lifecycle hooks (`init`, `renderDashboard`, `onSchedule`, etc.).
- System-wide events can be emitted and consumed (e.g., `onDayStart`, `onTaskComplete`).
- Enables cross-plugin communication and orchestration.

## Example Use Case: Fitness Tracker Dashboard

A user interested in managing their health and fitness may:

- Install the **Exercise Tracker** plugin to log workouts.
- Add the **Weight Tracker** plugin to visualise daily weight trends.
- Enable the **Hydration Tracker** plugin to monitor daily water intake.
- Drag all relevant widgets into a custom "Fitness" dashboard to view trends and stats in one place.

All three plugins can store data independently but interact through a shared UI. The user controls which widgets are displayed and how data is visualised.

## Platform Goals

**License**: Pustak is released under the [MIT License](https://opensource.org/licenses/MIT), allowing anyone to use, modify, and distribute the software freely, with minimal restrictions. This ensures maximum adoption, flexibility, and community-driven growth.

1. **Modular**: Every feature is a plugin; even core modules can be optional.
2. **Composable**: Dashboards and workflows can be composed by non-developers.
3. **Extensible**: Developers can write and publish plugins with custom UIs, schemas, and logic.
4. **Performant**: All interactions should be real-time, local-first, and secure.
5. **Portable**: Works across desktop and mobile with offline support and encrypted sync.
6. **Open Source**: Both the host application and core plugins are open source, encouraging contributions, audits, and decentralised ownership.

## Future Vision

- Collaborative plugins (shared to-dos, group challenges).
- Plugin marketplace with verified extensions.
- Plugin builder CLI and SDK for low-friction development.
- Smart assistant support (e.g., "show me my progress this week").

Pustak is not just a productivity tool. It’s a programmable environment for users to run their lives the way they want—highly customised, deeply personal, and endlessly extendable.