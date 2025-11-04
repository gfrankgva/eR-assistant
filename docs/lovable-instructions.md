# Lovable.dev Development Instructions - InfoTradeKenya Chatbot

## Overview of Lovable.dev

Lovable.dev is a platform that helps turn AI prompts into functioning web applications. It's especially well-suited for this InfoTradeKenya chatbot project as it allows rapid prototyping and deployment of AI-powered applications with minimal coding.

## Project Setup in Lovable.dev

### 1. Create a New Project

1. Sign in to [Lovable.dev](https://lovable.dev/)
2. Click "New Project" or similar option
3. Name your project "InfoTradeKenya-ChatAssistant"
4. Choose "Web Application" as the project type

### 2. Define Your Application Structure

Create the following structure in your project:

```
ChatAssistant/
├── Pages/
│   ├── MainWidget.jsx
│   └── TestPage.jsx
├── Components/
│   ├── ChatWidget.jsx
│   ├── ChatBubble.jsx
│   ├── ChatInput.jsx
│   └── ContextExtractor.jsx
├── Services/
│   ├── ApiService.js
│   └── ContentScraper.js
├── Styles/
│   └── ChatStyles.css
└── Config/
    └── AppConfig.js
```

### 3. Key Component Implementation

#### ChatWidget Component

This is the main container for your chat interface:

```jsx
// Provide this as a prompt to Lovable.dev

Create a ChatWidget component with these features:
- Floating button in the bottom-right corner
- Expandable chat window
- Header with "InfoTradeKenya Assistant" title
- Messages container with scrollable area
- Input field with send button
- State management for messages and UI states
- Responsive design that works on mobile and desktop

The component should toggle between collapsed and expanded states when clicked.
When expanded, it should show the message history and input field.
```

#### ChatBubble Component

For rendering individual messages:

```jsx
// Provide this as a prompt to Lovable.dev

Create a ChatBubble component that:
- Accepts message text, sender type (user/bot), and timestamp props
- Renders user messages right-aligned with blue background
- Renders bot messages left-aligned with light gray background
- Supports markdown formatting in messages
- Shows a typing indicator when isLoading is true
- Properly formats links, lists, and emphasized text
- Is fully responsive
```

#### ContextExtractor Component

This utility component will extract page context:

```jsx
// Provide this as a prompt to Lovable.dev

Create a ContextExtractor utility component that:
- Runs on page load to extract information from the current page
- Identifies the procedure ID from the URL path
- Extracts the page title, headings, and structured content
- Specifically looks for procedure steps, requirements, and contact information
- Returns a structured context object containing all extracted information
- Works with InfoTradeKenya's page structure
- Has fallback behavior for pages with different structures
```

### 4. Setting Up AI Integration with Lovable

Lovable.dev excels at AI integrations. Set up your OpenAI connection with:

```
// Provide this as a prompt to Lovable.dev

Create an AI service for my chatbot that:
- Connects to OpenAI's API
- Creates appropriate system prompts based on extracted page context
- Handles user queries and returns AI responses
- Properly formats the conversation for the AI
- Manages API rate limiting and error handling
- Caches frequent responses to reduce API costs
- Provides hooks for tracking analytics
```

### 5. Creating the Embed Script

To embed your chatbot on InfoTradeKenya:

```
// Provide this as a prompt to Lovable.dev

Create an embed script that:
- Can be added to any website with a single script tag
- Loads all necessary resources asynchronously
- Initializes the chat widget in the bottom-right corner
- Extracts page context automatically
- Connects to our AI backend
- Is lightweight and doesn't impact page performance
- Works with all modern browsers
- Has fallback behavior for older browsers
```

## Step-by-Step Development Guide with Lovable.dev

### Phase 1: Basic Implementation (1-2 weeks)

1. **Day 1-2: Project Setup**
   - Create project in Lovable.dev
   - Define component structure
   - Set up basic UI components

2. **Day 3-5: Core Functionality**
   - Implement chat interface
   - Create context extraction logic
   - Set up basic AI integration
   - Test on sample pages

3. **Day 6-7: Styling and Responsiveness**
   - Refine UI appearance
   - Ensure mobile compatibility
   - Implement animations and transitions
   - Test across different viewports

4. **Day 8-10: Initial Testing**
   - Deploy test version
   - Test with sample questions
   - Refine AI responses
   - Fix any UI/UX issues

### Phase 2: Enhanced Features (2-3 weeks)

1. **Day 1-3: Advanced Context Understanding**
   - Improve page content extraction
   - Add structure recognition for procedures
   - Implement semantic understanding of content

2. **Day 4-7: AI Response Quality**
   - Train AI with procedure-specific knowledge
   - Implement response formatting
   - Add step-by-step guidance capability
   - Test with complex scenarios

3. **Day 8-10: User Experience Improvements**
   - Add typing indicators
   - Implement message history
   - Create suggested questions
   - Add feedback collection

4. **Day 11-14: Embed Script and Deployment**
   - Create production-ready embed script
   - Set up proper error handling
   - Implement analytics tracking
   - Test on staging environment

### Phase 3: Production Refinement (1-2 weeks)

1. **Day 1-3: Performance Optimization**
   - Optimize loading speed
   - Implement caching strategies
   - Reduce bundle size
   - Test performance metrics

2. **Day 4-7: Security and Compliance**
   - Ensure data privacy compliance
   - Implement proper security measures
   - Set up monitoring and alerts
   - Document security features

3. **Day 8-10: Final Testing and Launch**
   - Comprehensive testing across devices
   - User acceptance testing
   - Final adjustments based on feedback
   - Production deployment

## Working with Lovable.dev - Practical Tips

### Effective Prompting

To get the best results from Lovable.dev, use these prompting techniques:

1. **Be Specific about Functionality**
   - Describe exactly what the component should do
   - Specify all edge cases and error states
   - Include specific UI behaviors and interactions

2. **Provide Visual References**
   - Upload screenshots or mockups when available
   - Describe visual elements clearly
   - Reference familiar UI patterns

3. **Iterate Gradually**
   - Start with basic functionality, then enhance
   - Review and refine before adding complexity
   - Use feedback from each iteration to improve prompts

### Example Prompts for Key Features

#### Implementing Context-Awareness

```
Create a function that extracts context from InfoTradeKenya procedure pages with these steps:

1. Identify the procedure ID from the URL (e.g., "2379" from "procedure/2379")
2. Extract the main heading as the procedure title
3. Look for elements with class "procedure-step" to identify steps
4. For each step, extract the heading and description
5. Find elements with class "requirements" and extract list items
6. Look for contact information in elements with class "contact-info"
7. Return a structured object with this information
8. Include error handling if the page structure is different
9. Make it efficient to avoid impacting page performance
```

#### Creating the Chat Interface

```
Design a chat interface with these requirements:

1. Floating chat bubble in the bottom right corner
2. When clicked, expands to a chat window (350px wide, 500px tall)
3. Chat window has a header with "InfoTradeKenya Assistant" and close button
4. Messages area shows conversation history
5. User messages appear on the right with blue background
6. Bot messages appear on the left with light gray background
7. Input area at bottom with text field and send button
8. Support for markdown formatting in messages
9. Typing indicator when waiting for response
10. Responsive design that works on mobile
11. Smooth transitions between states
```

#### Implementing AI Response Logic

```
Create a service that handles AI interactions with these requirements:

1. Connect to OpenAI API using credentials from environment variables
2. Format prompts that include page context:
   - Procedure title and ID
   - Steps and requirements
   - Any other relevant page content
3. Send user message along with context to OpenAI
4. Process and format the response for display
5. Handle API errors gracefully
6. Implement retry logic for failed requests
7. Cache common responses to reduce API usage
8. Support conversation history in prompts
9. Keep responses focused on the current procedure
```

## Deployment Strategy with Lovable.dev

### 1. Testing Environment

Before deploying to production:

1. Use Lovable.dev's preview functionality
2. Test on a staging subpage of your website
3. Gather feedback from test users
4. Make necessary adjustments

### 2. Production Deployment

When ready for production:

1. Export the final application from Lovable.dev
2. Host the embed script on a reliable CDN
3. Add the script tag to InfoTradeKenya pages:

```html
<script src="https://your-cdn.com/chatbot-embed.js" async></script>
```

### 3. Monitoring and Maintenance

After deployment:

1. Set up usage analytics
2. Monitor error logs
3. Collect user feedback
4. Schedule regular content updates
5. Plan feature enhancements based on user behavior

## Integration with InfoTradeKenya

### 1. Frontend Integration

The simplest approach is adding the embed script to the site's footer:

```html
<!-- Add just before closing </body> tag -->
<script src="https://your-deployment-url.com/embed.js" async></script>
```

### 2. Context Sharing

For better performance, consider adding a structured data object:

```html
<script>
window.infoTradeData = {
  procedureId: "2379",
  procedureTitle: "Acquisition of Authorization for Importation of Wheat & Meslin",
  steps: [
    {
      title: "Step 1: Submit Application",
      description: "Fill out the application form and submit with required documents."
    },
    // Other steps...
  ],
  requirements: [
    "Valid business license",
    "Tax compliance certificate",
    // Other requirements...
  ]
};
</script>
```

### 3. Style Customization

Allow for customization with CSS variables:

```html
<style>
  :root {
    --itk-chat-primary: #0066cc;
    --itk-chat-secondary: #f1f1f1;
    --itk-chat-text: #333333;
    --itk-chat-border-radius: 8px;
    --itk-chat-font: 'Arial', sans-serif;
  }
</style>
```

## Troubleshooting Common Issues

### 1. Integration Problems

If the chatbot doesn't appear:

1. Check browser console for JavaScript errors
2. Verify the embed script is loaded correctly
3. Test with a simpler page structure
4. Try adding the script earlier in the page

### 2. Context Extraction Issues

If the chatbot doesn't understand page content:

1. Inspect the page HTML structure
2. Update the context extraction selectors
3. Add fallback content for important procedures
4. Consider using a structured data approach

### 3. AI Response Quality

If responses are low quality:

1. Review system prompts
2. Add more specific context about procedures
3. Improve error handling for edge cases
4. Consider fine-tuning the AI model with domain-specific data
