# Sequenced Prompts for Lovable.dev

## Phase 1: Core Framework Development

### Prompt 1.1: Widget Foundation and Core UI (Per Image 1)
```
Create the core foundation for an embeddable webchat widget as shown in the first image, with the following specifications:
- Main widget controller that handles initialization
- Configuration management system that accepts customization options
- Event handling system for internal communication
- Floating button UI with customizable icon (like the "I" used for "Invest in Angola" in the example image)
- Expandable chat window with configurable dimensions
- Basic header with title and close button
- Minimal initial payload (<50KB)

The code should follow these principles:
- Modular architecture with clear separation of concerns
- Well-documented using JSDoc standards
- No external dependencies except what's absolutely necessary
- Browser compatibility with Chrome, Firefox, Safari, and Edge

Deliverable format:
- JavaScript module structure following ES6 standards
- HTML test page demonstrating the widget loading
- Documentation explaining configuration options
```

### Prompt 1.2: Chat Interface Implementation
```
Building on the widget foundation previously created, implement a basic chat interface with these features:
- Minimizable chat bubble that expands into a full chat window
- Message display area with support for text formatting
- User input area with send button
- Basic theme support (light/dark modes)
- Responsive design that works on mobile and desktop

Technical requirements:
- Use CSS-in-JS for style isolation
- Implement smooth animations for transitions
- Ensure keyboard accessibility for input
- Store chat state in memory with option to persist

Example configuration:
{
  position: 'bottom-right',
  size: {
    width: '360px',
    height: '500px'
  },
  theme: {
    primary: '#0074D9',
    secondary: '#7FDBFF',
    text: '#001F3F',
    background: '#FFFFFF'
  },
  header: {
    title: 'How can we help?',
    showCloseButton: true
  },
  bubbleIcon: 'chat',
  animations: {
    openDuration: 300,
    closeDuration: 200
  }
}
```

### Prompt 1.3: Backend Integration
```
Extend the chat widget with backend communication capabilities:
- Implement RESTful API communication for messages
- Create a message queue for reliability during connection issues
- Add local storage for conversation persistence
- Develop a simple mock backend for testing

Key requirements:
- Handle connection failures gracefully with retries
- Implement proper error handling and user feedback
- Support both synchronous and asynchronous messaging
- Include typing indicators during response generation

Please document the API interface thoroughly, including:
- Endpoint structures
- Authentication methods
- Payload formats
- Error handling patterns
```

## Phase 2: Admin Interface & LLM Integration

### Prompt 2.1: Admin Panel Framework and Dashboard
```
Create an admin panel framework for configuring the webchat widget:
- Secure login portal with authentication system
- Dashboard for monitoring chat usage and performance
- Tab-based navigation for different setting categories
- Settings persistence (local storage and/or server-side)
- Configuration export/import functionality
- Real-time preview of configuration changes

Structure the admin panel with these sections:
- Dashboard with usage metrics and performance indicators
- General settings (appearance, behavior)
- Knowledge base management (placeholder for next prompt)
- System prompt configuration with markdown support
- LLM configuration (placeholder for next prompt)
- Advanced settings (debugging, performance)
- Multi-language support configuration

The admin panel should be accessible via:
- A special query parameter on the main site
- A dedicated admin URL
- An admin button that appears after a special key combination
```

### Prompt 2.2: Comprehensive Knowledge Base Management (Per Image 2)
```
Implement comprehensive knowledge base management capabilities in the admin panel:
- File upload component with drag-and-drop and progress indicators
- URL scraping functionality with configurable crawling options
- Table/structured data import tools
- Web search integration options
- Rich text editor for direct content creation with markdown support
- API configuration for external knowledge sources
- Toggle controls to enable/disable knowledge sources
- Visual representation of knowledge sources with distinctive icons for each type (file, URL, API, etc.)

Technical requirements:
- Handle multiple file formats (PDF, DOCX, TXT, CSV, etc.)
- Implement chunking for large documents
- Create preview functionality for uploaded content
- Add organization capabilities (folders, tags)
- Context extraction rules configuration
- Knowledge base browsing interface similar to the second image in requirements

The knowledge management system should:
- Display upload status and processing progress
- Allow editing/deletion of existing knowledge items
- Support search within the knowledge base
- Provide analytics on knowledge usage
```

### Prompt 2.3: LLM Integration
```
Develop LLM integration components that connect with multiple providers:
- Abstract provider interface for consistent integration
- Specific integrations for Claude 3.7, DeepSeek R1, and OpenAI 4.0
- Prompt template system with variables for customization
- Context management for maintaining conversation history

Implementation requirements:
- Token counting and rate limit management
- Streaming response support for immediate feedback
- Fallback mechanisms if primary provider fails
- Cost optimization strategies

Admin configuration options should include:
- API key management (secure storage)
- Model selection within each provider
- Temperature and other generation parameters
- Context window size configuration
```

## Phase 3: Voice & Advanced Features

### Prompt 3.1: Voice Input Implementation
```
Create voice input capabilities for the webchat widget:
- Audio recording system with permission handling
- Speech recognition integration with multiple language support
- Background noise filtering for improved accuracy
- Visual feedback during recording

Technical considerations:
- Use WebRTC for audio capture
- Implement client-side voice activity detection
- Add timeout handling for long recordings
- Create fallback to text input when voice fails

The UI should include:
- Microphone button with clear states (inactive, listening, processing)
- Visual audio level indicator during recording
- Transcript preview before sending
- Easy way to cancel and retry voice input
```

### Prompt 3.2: Voice Output System
```
Implement voice output capabilities for the webchat widget:
- Text-to-speech integration with natural-sounding voices
- Audio playback system with controls (pause, resume, stop)
- Voice configuration options (voice selection, rate, pitch)
- Smooth audio streaming for longer responses

Requirements:
- Support multiple languages and accents
- Implement SSML for better pronunciation control
- Add word highlighting during speech (if possible)
- Create a mute/unmute toggle that persists user preference

Integration considerations:
- Handle interruptions gracefully (new messages during playback)
- Implement queuing for multiple consecutive messages
- Add background audio ducking during speech
- Ensure accessibility compliance
```

### Prompt 3.3: Procedure Navigation
```
Develop a procedure navigation system for guiding users through step-by-step processes:
- Step tracking mechanism that identifies current position
- Progress visualization showing completed and remaining steps
- Contextual assistance based on the current procedure step
- Bookmarking capability for returning users

The system should:
- Extract procedure structure from eRegulations or similar sites
- Match user queries to relevant procedure steps
- Provide clear next steps and requirements
- Track common obstacles and provide preemptive guidance

UI elements to implement:
- Progress bar or step indicator
- Step summary with expandable details
- Related document/form links for each step
- Previous/next navigation controls
```

## Phase 4: Virtual Human Interface and Platform Integration

### Prompt 4.1: Avatar Framework
```
Create a WebGL-based avatar framework for the virtual human interface:
- Asset loading system for 3D models and textures
- WebGL renderer with fallback for unsupported browsers
- Basic animation system for idle and speaking states
- Toggle mechanism between chat widget and avatar modes

Technical requirements:
- Optimize for performance (target 30fps on mid-range devices)
- Implement level-of-detail for different device capabilities
- Create proper resource management and cleanup
- Support both realistic and stylized avatar options

The implementation should include:
- Camera position management for optimal framing
- Lighting setup that works across avatar styles
- Background options (transparent, solid color, scene)
- Initialization sequence with loading indicators
```

### Prompt 4.2: Lip Sync & Expressions
```
Enhance the avatar with lip synchronization and facial expressions:
- Audio-driven lip sync that matches speech patterns
- Facial expression system supporting multiple emotions
- User emotion detection from text and/or voice
- Natural transitions between expression states

Implementation details:
- Use phoneme detection for accurate mouth shapes
- Create a blend shape system for expressions
- Implement expression intensity controls
- Add subtle idle animations for lifelike appearance

The system should support these expressions at minimum:
- Neutral, happy, thoughtful, concerned
- Appropriate reactions to user emotions
- Welcome and goodbye expressions
- Listening indicators during user input
```

### Prompt 4.3: Platform Integration & Analytics
```
Complete the virtual human integration with platform-specific features and analytics:
- Seamless mode switching between chat widget and avatar
- Personalized welcome system based on user history
- Platform detection for different eRegulation systems
- Comprehensive analytics dashboard for performance monitoring
- Final UI polishing and performance optimization

Analytics to implement:
- Conversation quality metrics (completion rate, satisfaction)
- Knowledge gap identification (unanswered questions)
- Session duration and engagement metrics
- Platform-specific usage patterns
- A/B testing framework for different configurations

Platform integration features:
- eRegulations-specific context extraction
- Domain-specific terminology recognition
- Procedure-aware navigation
- Country/region detection and adaptation

Additional integration features:
- Smooth transitions when switching modes
- State persistence across mode changes
- Preference memory for returning users
- Graceful fallbacks for all features
```

## Phase 5: Testing & Deployment

### Prompt 5.1: Comprehensive Testing
```
Develop comprehensive testing strategies and implement test suites:
- Unit tests for all core components
- Integration tests for feature combinations
- End-to-end tests for critical user journeys
- Performance benchmarks against acceptance criteria

Tests should cover:
- Browser compatibility (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness on various devices
- Accessibility compliance with WCAG standards
- Error handling and recovery scenarios

Include these specific test cases:
- Widget initialization on different site layouts
- Conversation flow through multiple turns
- Knowledge retrieval accuracy
- Voice input/output in noisy environments
- Avatar performance on low-end devices
```

### Prompt 5.2: Documentation & Deployment
```
Create comprehensive documentation and deployment scripts:
- Developer documentation with integration guide
- Admin user manual with configuration examples
- End-user documentation for widget features
- Deployment scripts for various hosting environments

Documentation should include:
- Getting started guide with quick installation steps
- API reference with complete method descriptions
- Configuration options with examples
- Troubleshooting guide for common issues

Deployment considerations:
- CDN setup for optimal asset delivery
- Versioning strategy for updates
- Cache control recommendations
- Performance monitoring setup
```
