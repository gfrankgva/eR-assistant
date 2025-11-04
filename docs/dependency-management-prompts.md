# Dependencies Management Feature Development Prompts

## Prompt 1: Core Dependencies Table & UI Implementation

```
Implement a dependencies management system for the webchat widget admin interface following the provided UI design:

1. Data structure to track:
   - Dependency name
   - Current version
   - Latest available version
   - Status (up-to-date, update available, critical update)
   - Type categorization (frontend, backend, API integration, etc.)
   - Component usage (where in the application it's used)
   - Last updated timestamp

2. Create a responsive table UI matching the design comp with:
   - Clean dashboard layout with status summary pills (counts by category)
   - Color-coded status indicators (green, yellow, red, blue)
   - Sortable columns with proper spacing
   - Action menu for each dependency
   - Pagination controls

3. Implement search and filtering with:
   - Text search across all fields
   - Status filter dropdown (All, Up to date, Updates available, Critical, Alternative)
   - Type filter dropdown (Frontend, Backend, API, etc.)
   - Component filter dropdown

4. Design the backend service to:
   - Parse package.json/requirements.txt for initial dependency detection
   - Store dependency metadata in the database
   - Create API endpoints for retrieving and updating dependency information

Follow the provided visual design for colors, spacing, typography, and interactive elements.

Reference the SVG design comp showing:
- Header with page title
- Search bar with filter dropdowns
- Status summary pills with counts and color coding
- Clean table layout with status indicators
- Pagination controls at bottom
```

## Prompt 2: Version Checking & Notification System

```
Extend the dependencies management system with automatic version checking and notifications:

1. Implement version checking service that:
   - Connects to npm, PyPI, or relevant package registries
   - Periodically checks for new versions of tracked dependencies
   - Identifies security vulnerabilities via integration with vulnerability databases
   - Updates the dependency status in the database

2. Create notification system with:
   - Configurable alert types (critical, security, feature, minor updates)
   - Multiple delivery channels (email, dashboard, webhook for Slack/Teams)
   - Alert recipient management
   - Notification frequency settings (immediate, daily, weekly digest)

3. Develop notification UI components:
   - Notification settings page in admin interface
   - Alert badges and counters in the admin navigation
   - Notification center for viewing all alerts

4. Implement bulk notification management:
   - Mark as read functionality
   - Notification filtering and search
   - Notification retention policy settings

Ensure all scheduled tasks are properly configured with fallback mechanisms for failed checks.
```

## Prompt 3: Dependency Details Modal & Update Management

```
Implement the detailed dependency modal view and update management functionality following the provided design:

1. Create a detailed dependency modal showing:
   - Header with dependency name and version
   - Tabbed interface (Overview, Alternatives, History, Security)
   - Description and metadata section
   - Blue highlight box for better alternative recommendations
   - Component usage badges
   - Action buttons for update and switching to alternative

2. Develop update management workflow:
   - One-click update capability with loading state
   - Scheduled update functionality with datetime picker
   - Pre-update backup system
   - Post-update testing integration
   - Automatic rollback on failure

3. Implement bulk update management:
   - Multi-select functionality for dependencies
   - Batch update scheduling
   - Unified progress tracking for multiple updates
   - Success/failure reporting

4. Create update history logging:
   - Record all update attempts (successful and failed)
   - Store before/after versions
   - Track who initiated the update
   - Document any issues encountered

Match the visual design of the modal with proper spacing, typography, and interactive elements as shown in the provided comp, including:
- Modal with header and close button
- Tabbed navigation
- Blue highlight box for alternative recommendations
- Component usage badges with rounded corners
- Primary (green) and secondary (gray) action buttons
```

## Prompt 4: Alternative Dependency Recommendations

```
Implement an intelligent system for recommending better alternatives to current dependencies:

1. Create a recommendation engine that:
   - Maintains a database of alternative libraries with similar functionality
   - Compares dependencies based on multiple criteria (performance, size, security, community support)
   - Monitors trending libraries in each category
   - Generates "upgrade path" recommendations with complexity estimates

2. Implement analytics that evaluate:
   - Download trends and community adoption
   - GitHub stars, contributors, and commit frequency
   - Bundle size and performance benchmarks
   - Security vulnerability history
   - Breaking changes between versions

3. Develop an alert system for better alternatives:
   - Configurable thresholds for recommendation triggers (e.g., 30% smaller bundle size)
   - Notification integration with the existing alert system
   - "Better Alternative Available" status indicator in the main dependency table
   - Comparative metrics visualization

4. Create a recommendation details view:
   - Side-by-side comparison of current vs. recommended dependency
   - Migration difficulty assessment
   - Code snippet examples showing usage differences
   - Community adoption statistics
   - Estimated benefits (performance gains, reduced vulnerabilities)

Ensure recommendations are contextually aware of the project's tech stack and don't suggest incompatible alternatives.
```

## Prompt 5: Dependency Visualization & Advanced Features

```
Implement advanced dependency management features:

1. Create interactive dependency graph visualization:
   - Hierarchical view of direct and transitive dependencies
   - Visual indicators of dependency relationships
   - Size representation based on impact/bundle size
   - Color coding for security status and update urgency
   - Zoom and filter capabilities

2. Develop security audit integration:
   - Automated security scanning of dependencies
   - CVE database integration
   - Severity ranking of vulnerabilities
   - Remediation recommendations
   - Scheduled security audit reports

3. Implement custom integration options:
   - GitHub webhook integration for automatic updates on releases
   - CI/CD pipeline integration configuration
   - Customizable notification webhooks
   - API for external dependency reporting

4. Add dependency performance impact analysis:
   - Bundle size impact metrics
   - Load time impact estimation
   - Runtime performance considerations
   - Mobile vs desktop performance differences

Ensure all visualizations are accessible and degrade gracefully in browsers without advanced capabilities.
```

## Prompt 6: Testing & Documentation

```
Complete the dependencies management system with comprehensive testing and documentation:

1. Implement test suite covering:
   - Unit tests for all service functions
   - Integration tests for update workflows
   - UI tests for admin interface components
   - Mock package registry for testing version checks
   - Notification delivery verification

2. Create comprehensive documentation:
   - Admin user guide for the dependencies management feature
   - API documentation for integration purposes
   - Troubleshooting guide for common issues
   - Development guide for extending the system

3. Prepare onboarding materials:
   - Walkthrough video of key features
   - Quick start guide for new admins
   - Example scenarios for dependency management

4. Implement telemetry for feature usage:
   - Track most used filters and views
   - Measure time saved through bulk updates
   - Monitor notification effectiveness
   - Gather feedback on feature usefulness

Ensure all documentation follows the project's documentation standards and is accessible within the admin interface help system.
```
