# LLM-API Integration Methods for Tanzania Trade Portal

## Overview

This document outlines methods for integrating Large Language Models (LLMs) with the Tanzania Trade Portal API to create an effective chatbot for guiding users through trade procedures. The integration approach must enable LLMs to query the API appropriately, process responses, and provide relevant guidance to users.

## Integration Architecture Options

### 1. Direct API Integration

**Description:**
The LLM directly generates API calls to the Tanzania Trade Portal API based on user queries.

**Components:**
- LLM (ChatGPT, Claude, or DeepSeek)
- API connection layer
- Response parsing module
- Context management system

**Flow:**
1. User query → LLM
2. LLM generates API call
3. System executes API call
4. API response → LLM
5. LLM formulates user response

**Advantages:**
- Simpler architecture
- Fewer components to maintain
- More direct control for the LLM

**Disadvantages:**
- Requires careful prompt engineering
- Higher risk of hallucinated API calls
- Less efficient for complex query patterns

**Suitability Score: 6/10**

### 2. Middleware-Based Integration

**Description:**
A middleware layer sits between the LLM and the API, translating LLM instructions into appropriate API calls.

**Components:**
- LLM (ChatGPT, Claude, or DeepSeek)
- Middleware translation layer
- API client module
- Response transformation module
- Context management system

**Flow:**
1. User query → LLM
2. LLM generates middleware instructions
3. Middleware translates to API call(s)
4. API response → Middleware
5. Middleware transforms response
6. Transformed response → LLM
7. LLM formulates user response

**Advantages:**
- More robust error handling
- Reduced hallucination risk
- Can optimize API usage patterns
- Better handling of complex query patterns

**Disadvantages:**
- More complex architecture
- Additional component to maintain
- Potential latency increase

**Suitability Score: 8/10**

### 3. Function-Calling Integration

**Description:**
The LLM uses function calling capabilities to invoke predefined functions that interact with the API.

**Components:**
- LLM with function calling support (ChatGPT, Claude)
- Function definitions for API operations
- Function execution environment
- Response processing functions
- Context management system

**Flow:**
1. User query → LLM
2. LLM selects appropriate function and parameters
3. System executes function (making API call)
4. API response processed by function
5. Function result → LLM
6. LLM formulates user response

**Advantages:**
- Structured approach to API interaction
- Reduced hallucination risk
- Clear separation of responsibilities
- Leverages latest LLM capabilities

**Disadvantages:**
- Requires LLMs with function calling support
- Needs careful function definition
- May be less flexible for novel queries

**Suitability Score: 9/10**

## Recommended Integration Method

Based on the analysis, the **Function-Calling Integration** approach is recommended for the Tanzania Trade Portal API chatbot, with the following implementation details:

### Key Functions to Implement

1. **searchProceduresByKeyword(keyword)**
   - Maps to: `/Objectives/Search`
   - Purpose: Find procedures based on user's natural language description

2. **searchProceduresByFilters(filters)**
   - Maps to: `/Objectives/SearchByFilters`
   - Purpose: Find procedures matching specific criteria

3. **getProcedureDetails(procedureId)**
   - Maps to: `/Procedures/{id}`
   - Purpose: Retrieve complete information about a specific procedure

4. **getProcedureProgress(procedureId)**
   - Maps to: `/Country/Progress/{id}`
   - Purpose: Get information about procedure steps and status

5. **getFormDetails(formId)**
   - Maps to: `/Forms/{id}`
   - Purpose: Get details about required documentation

6. **getContactInformation(contactId)**
   - Maps to: `/Contacts/{id}`
   - Purpose: Retrieve contact information for relevant entities

### Implementation Considerations

1. **Function Parameter Mapping**
   - Develop a system to map natural language descriptions to structured filter parameters
   - Create validation logic for parameters before API calls
   - Implement parameter transformation where needed

2. **Response Processing**
   - Create standardized response formats for each function
   - Implement error handling and fallback mechanisms
   - Develop methods to simplify complex API responses

3. **Context Management**
   - Maintain session context to track user's progress
   - Store previously retrieved procedure IDs and details
   - Implement context-aware function selection

4. **Conversation Flow**
   - Design conversation patterns for common procedure inquiries
   - Create clarification prompts for ambiguous queries
   - Develop follow-up question patterns

## Technical Implementation Example

```python
# Function definitions for LLM function calling

def search_procedures_by_keyword(keyword):
    """
    Search for procedures using a keyword.
    
    Args:
        keyword (str): The search term provided by the user
        
    Returns:
        dict: Formatted results with procedure summaries
    """
    # Call the API
    response = api_client.post("/Objectives/Search", json={"keyword": keyword})
    
    if response.status_code == 200:
        results = response.json()
        # Transform the results into a more LLM-friendly format
        formatted_results = {
            "found": len(results) > 0,
            "count": len(results),
            "procedures": [
                {
                    "id": item.get("id"),
                    "title": item.get("title"),
                    "summary": item.get("summary", "No summary available")
                }
                for item in results
            ]
        }
        return formatted_results
    else:
        return {"error": f"API error: {response.status_code}", "found": False}

def get_procedure_details(procedure_id):
    """
    Get detailed information about a specific procedure.
    
    Args:
        procedure_id (int): The ID of the procedure
        
    Returns:
        dict: Formatted procedure details
    """
    # Call the API
    response = api_client.get(f"/Procedures/{procedure_id}")
    
    if response.status_code == 200:
        procedure = response.json()
        
        # Transform into LLM-friendly format
        steps = []
        for step in procedure.get("steps", []):
            steps.append({
                "number": step.get("stepNumber"),
                "title": step.get("title"),
                "description": step.get("description"),
                "timeframe": step.get("timeframe"),
                "cost": step.get("cost")
            })
            
        formatted_procedure = {
            "id": procedure.get("id"),
            "title": procedure.get("title"),
            "description": procedure.get("description"),
            "steps_count": len(steps),
            "steps": steps,
            "required_documents": [
                {"id": doc.get("id"), "name": doc.get("name")}
                for doc in procedure.get("requiredDocuments", [])
            ],
            "contacts": [
                {"id": contact.get("id"), "name": contact.get("name")}
                for contact in procedure.get("contacts", [])
            ]
        }
        return formatted_procedure
    else:
        return {"error": f"API error: {response.status_code}"}
```

## LLM Prompt Design for Function Calling

To effectively use the function calling integration, the LLM should be initialized with a prompt that:

1. Explains the available functions and their purposes
2. Provides guidelines for when to use each function
3. Establishes a conversation flow for guiding users
4. Sets expectations for response formatting

Example prompt structure:
```
You are a helpful assistant for the Tanzania Trade Portal, guiding users through trade procedures. 
You have access to the following functions to retrieve information:

- searchProceduresByKeyword: Use when a user describes what they want to do without knowing the procedure name
- searchProceduresByFilters: Use when a user provides specific criteria about their situation
- getProcedureDetails: Use when you need complete information about a specific procedure
- getProcedureProgress: Use when you need information about the steps and status of a procedure
- getFormDetails: Use when you need details about required documentation
- getContactInformation: Use when you need contact information for relevant entities

When a user asks about a trade procedure:
1. First determine if you need to search for procedures or if you already know the procedure ID
2. If searching, use the appropriate search function
3. Once you have a procedure ID, get the complete details
4. Present the information in a clear, step-by-step format
5. Offer to provide more details about specific steps, forms, or contacts

Always maintain a helpful, informative tone and focus on guiding the user through the procedure.
```
