# Repair Guidelines for Lovable LLM Connection Module

## Introduction

This document provides detailed guidelines for repairing the LLM connection module in your Regulatory Navigator Bot. The current implementation has issues connecting to various LLM providers (ChatGPT/OpenAI, Claude/Anthropic, and DeepSeek). These guidelines will help you systematically address these issues while minimizing disruption to other parts of the system.

## Implementation Approach

### Phase 1: Diagnostic Improvements

Before making significant changes to the code, implement these diagnostic enhancements to better understand the issues:

1. **Add Comprehensive Logging**
   - Implement detailed request/response logging for all LLM API calls
   - Log timestamps, request parameters, response status codes, and error messages
   - Create a debug mode that can be enabled in the UI for troubleshooting

2. **Create API Health Check Tool**
   - Implement a simple health check function for each LLM provider
   - Add a "Test Connection" button in the admin UI
   - Display detailed diagnostic information when tests fail

### Phase 2: Core Fixes by Provider

#### 1. ChatGPT/OpenAI Fixes

**Issue**: False rate limit detection - system incorrectly reports rate limit is reached

1. **Refine Error Detection Logic**:
   - Update `isQuotaOrRateLimitError()` in `errorHandlers.ts` to use more specific matching criteria
   - Parse OpenAI error responses more carefully to extract exact error types and codes
   - Distinguish between actual rate limits and other API errors

2. **Improve Error Response Handling**:
   - Enhance the error handling in `openaiService.ts` to properly parse OpenAI's error format
   - Extract and use the specific error type and code from OpenAI responses
   - Implement different handling for different types of 429 errors (rate limit vs. quota)

#### 2. Claude/Anthropic Fixes

**Issue**: CORS problems preventing successful API calls

1. **Server-Side API Integration (Recommended)**:
   - Create a simple backend service (Node.js/Express) to handle Anthropic API calls
   - Deploy this service to a platform like Vercel, Netlify, or Render
   - Update the frontend to call your backend service instead of directly calling Anthropic

2. **If Server-Side Option Not Possible**:
   - Improve the proxy implementation with better error handling and multiple fallback options
   - Add timeout handling for proxy requests
   - Implement a more robust proxy testing mechanism

#### 3. DeepSeek Fixes

**Issue**: No answer from DeepSeek API

1. **Create Dedicated DeepSeek Service**:
   - Implement a separate service file for DeepSeek instead of using the OpenAI client
   - Ensure proper formatting of requests according to DeepSeek's API documentation
   - Add DeepSeek-specific error handling and response parsing

2. **Fix Configuration Issues**:
   - Ensure the base URL is correctly set for DeepSeek
   - Validate the model names being used are supported by DeepSeek
   - Add proper validation for DeepSeek API keys

### Phase 3: Architectural Improvements

These changes will improve the overall architecture of the LLM connection module:

1. **Unified Error Handling System**:
   - Create a standardized error type for all API errors
   - Implement consistent error classification across all providers
   - Improve error messages for end users

2. **Request Queue and Retry System**:
   - Implement a queue for LLM requests with automatic retries
   - Add exponential backoff for rate-limited requests
   - Implement graceful fallback between providers

3. **API Key Management**:
   - Improve the security of API key storage
   - Add validation for API key formats
   - Implement key rotation capabilities

## Implementation Steps

Follow these steps to implement the repairs:

### Step 1: Create Diagnostic Branch

```bash
# Create a new branch for diagnostic improvements
git checkout -b llm-connection-diagnostics

# Implement logging and diagnostics
# Test the diagnostics
# Commit changes

git add .
git commit -m "Add LLM connection diagnostics and logging"
```

### Step 2: Fix Each Provider Separately

```bash
# Create a branch for OpenAI fixes
git checkout -b fix-openai-connection

# Implement OpenAI fixes
# Test OpenAI connection
# Commit changes

git add .
git commit -m "Fix OpenAI connection and error handling"

# Repeat for Claude and DeepSeek
```

### Step 3: Implement Architectural Improvements

```bash
# Create a branch for architectural improvements
git checkout -b llm-architecture-improvements

# Implement unified error handling
# Add request queue system
# Improve API key management
# Test all providers
# Commit changes

git add .
git commit -m "Implement LLM connection architecture improvements"
```

### Step 4: Integration and Testing

```bash
# Create an integration branch
git checkout -b llm-connection-integration

# Merge all fix branches
git merge fix-openai-connection
git merge fix-claude-connection
git merge fix-deepseek-connection
git merge llm-architecture-improvements

# Resolve any conflicts
# Run comprehensive tests
# Commit final integration

git add .
git commit -m "Integrate all LLM connection fixes"
```

## Detailed Code Changes

### 1. OpenAI Error Handling Fix

In `src/services/base/errorHandlers.ts`:

```typescript
// Update the rate limit detection function
export function isQuotaOrRateLimitError(error: Error): boolean {
  const message = error.message.toLowerCase();
  
  // More specific matching to avoid false positives
  return (
    message.includes("rate_limit_exceeded") ||
    message.includes("insufficient_quota") ||
    (message.includes("rate limit") && message.includes("exceeded")) ||
    (message.includes("quota") && message.includes("exceeded"))
  );
}
```

In `src/services/openai/openaiService.ts`:

```typescript
// Improve error response parsing
if (!response.ok) {
  const responseText = await response.text();
  let errorData;
  
  try {
    errorData = JSON.parse(responseText);
  } catch (e) {
    // Not JSON, use text as is
    throw new Error(`OpenAI API error: ${response.status} - ${responseText}`);
  }
  
  // Extract specific error type from OpenAI response
  const errorType = errorData.error?.type || '';
  const errorCode = errorData.error?.code || '';
  
  if (response.status === 429) {
    if (errorType === 'insufficient_quota' || errorCode === 'insufficient_quota') {
      throw new Error(`OpenAI API quota exceeded: ${errorData.error?.message}. Please check your billing status.`);
    } else {
      throw new Error(`OpenAI API rate limit reached: ${errorData.error?.message}. Try again in a few moments.`);
    }
  } else if (response.status === 401) {
    throw new Error(`Authentication failed: Your API key appears to be invalid or expired.`);
  }
  
  throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || responseText}`);
}
```

### 2. Claude/Anthropic CORS Fix

#### Option A: Server-Side Implementation (Recommended)

Create a new file `server/anthropic-proxy.js`:

```javascript
// Simple Express server to proxy Anthropic API requests
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// Proxy endpoint for Claude API
app.post('/api/claude', async (req, res) => {
  try {
    const { systemPrompt, prompt, apiKey, model } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }
    
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: model || 'claude-3-sonnet-20240229',
      system: systemPrompt,
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Claude API proxy error:', error.response?.data || error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data || error.message
      });
    } else {
      res.status(500).json({
        error: error.message
      });
    }
  }
});

// Health check endpoint
app.get('/api/claude/ping', (req, res) => {
  res.json({ status: 'ok', message: 'Claude proxy server is online' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Claude proxy server running on port ${PORT}`);
});
```

Then update `src/services/anthropic/anthropicService.ts` to use your server:

```typescript
export async function callAnthropicAPI(
  systemPrompt: string,
  prompt: string,
  config: LLMConfig,
  apiEndpoint?: string
): Promise<string> {
  try {
    // Your own server endpoint
    const PROXY_URL = 'https://your-deployed-server.vercel.app/api/claude';
    
    console.log(`Calling Claude API through your proxy: ${PROXY_URL}`);
    const proxyResponse = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemPrompt,
        prompt,
        apiKey: config.apiKey,
        model: config.modelName || 'claude-3-sonnet-20240229'
      })
    });
    
    if (!proxyResponse.ok) {
      const errorText = await proxyResponse.text();
      console.error("Proxy error response:", errorText);
      throw new Error(`Claude proxy error: ${proxyResponse.status} - ${errorText}`);
    }
    
    const data = await proxyResponse.json();
    return data.content[0].text;
  } catch (error) {
    throw handleApiError(error, 'Anthropic');
  }
}
```

### 3. DeepSeek Implementation Fix

Create a new file `src/services/deepseek/deepseekService.ts`:

```typescript
import { LLMConfig } from '@/types/llm';
import { handleApiError } from '../base/errorHandlers';

export async function callDeepSeekAPI(
  systemPrompt: string,
  prompt: string,
  config: LLMConfig,
  apiEndpoint?: string
): Promise<string> {
  try {
    // Ensure proper default baseUrl
    const baseUrl = config.baseUrl || 'https://api.deepseek.com';
    
    console.log("Calling DeepSeek API with base URL:", baseUrl);
    
    // Make the API request with proper format for DeepSeek
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.modelName || 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    // Detailed error handling specific to DeepSeek
    if (!response.ok) {
      const responseText = await response.text();
      console.error("DeepSeek API error response:", responseText);
      
      // Specific error handling for DeepSeek
      if (response.status === 401) {
        throw new Error(`DeepSeek authentication failed: Please check your API key.`);
      } else if (response.status === 404) {
        throw new Error(`DeepSeek API endpoint not found: ${baseUrl}/v1/chat/completions. Please verify the base URL.`);
      }
      
      throw new Error(`DeepSeek API error: ${response.status} - ${responseText}`);
    }
    
    const data = await response.json();
    
    // Validate response format
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid response format from DeepSeek:", data);
      throw new Error("Invalid response format from DeepSeek API");
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    throw handleApiError(error, 'DeepSeek');
  }
}
```

Then update `src/services/llmService.ts` to use this new service:

```typescript
// Add import for the new DeepSeek service
import { callDeepSeekAPI } from './deepseek/deepseekService';

// In the switch statement, update the DeepSeek case
case 'deepseek': {
  console.log("Using DeepSeek API");
  
  // Always ensure proper default baseUrl for DeepSeek
  if (!activeConfig.baseUrl || activeConfig.baseUrl.trim() === '') {
    activeConfig = {
      ...activeConfig,
      baseUrl: 'https://api.deepseek.com'
    };
    console.log("Setting default DeepSeek API URL:", activeConfig.baseUrl);
  }
  
  // Use dedicated DeepSeek service instead of OpenAI client
  return await callDeepSeekAPI(systemPrompt, prompt, activeConfig, apiEndpoint);
}
```

## Testing Guidelines

For each LLM provider, implement these tests:

1. **Basic Connectivity Test**:
   - Test API key validation
   - Test basic prompt/response functionality
   - Verify response format

2. **Error Handling Test**:
   - Test with invalid API keys
   - Test with malformed requests
   - Verify error messages are user-friendly

3. **Edge Case Tests**:
   - Test with very long prompts
   - Test with special characters
   - Test with concurrent requests

## Conclusion

By following these guidelines, you should be able to systematically repair the LLM connection issues in your application. The approach is designed to minimize disruption to other parts of the system while addressing the specific issues with each LLM provider.

Remember to:
1. Start with diagnostic improvements
2. Fix each provider separately
3. Implement architectural improvements
4. Test thoroughly before deploying to production

If you encounter any issues during implementation, the diagnostic tools added in Phase 1 should help identify the root causes.
