/**
 * LLM : 
 * ===
 * 1. What is LLM ?
 *    - LLM --> Large Language Model
 *    - It is a AI System trained with huge amount of datas like text,images,code and articles.
 *    - It will understand the human language and response on the same
 *    - It works based prabability and not based on knowledge
 *    - It will understand the context from the conversation and remember it for further answering.
 *    - It can perform multiple task like pdf,images,coding.
 *    - It will break the text in to a small unit called as Tokens.
 *    - Does LLM makes mistakes ? Sometime it give me the wrong answer or it will showcase that it can communicate with
 *     any tools and complete our task.
 *    - It ill learn based on pre-training and it will be fine tuned based on the conversation with human.
 *    - Human can interact with LLM using prompt. Better question will give you better answer and it will fine tune
 *      based on it.
 * 
 * LLM:
 * ====
 * - GPT(Generative Pre-Trained Transformer) --> Open AI
 * - Gemini(Google)
 * - Claude - Anthropic
 * - LLAMA - Meta
 * 
 * LLM Drawback
 * ============
 * - LLM will give you the output based on the avaiilable data, But it can not perform any action to be performed.
 *      To solve the issue we went for AI Agents on behalf of LLM.
 * 
 * MCP
 * ===
 *  - Model Context Protocol
 *  - Using MCP we can make communication between AI Model and tools or library or system.
 *  - Standardized communication between AI Agent and Tools
 *  - Using MCP we can define the context.
 * 
 * Architecture of Playwright MCP
 * =============================
 * User/QA -->AI Model (GPT,Claude,Gemini) --> MCP Client(VS Code + Github Copilot) --> MCP Server 
 * --> Playwright Engine too handle Browser Engine.
 * 
 * AI Agent
 * ========
 * GitHub Cupilot -> It is acting as AI-Power code completion tool developed by GitHub in collaboration with
 * Open AI.
 
 Step-by-Step Interaction Flow

Suppose the user gives the prompt:

"Open Amazon and search for PlayStation 5"

Step 1: User Sends Request

The QA Engineer types in VS Code Copilot Chat:
Open amazon.in and search for PlayStation 5

Step 2: AI Model Understands Intent

The AI Model (GPT/Claude/Gemini) converts the natural language instruction into structured actions.

Example:
1. Navigate to amazon.in
2. Locate search textbox
3. Enter PlayStation 5
4. Click Search

Note: At this point, no browser action has happened yet.

Step 3: MCP Client Receives the Request

The MCP Client (GitHub Copilot inside VS Code) acts as a bridge.
The client decides:
"This task requires browser automation."

So it forwards the request to the Playwright MCP Server.

Step 4: MCP Server Processes the Request

The Playwright MCP Server receives:

Navigate to amazon.in
Search PlayStation 5

The MCP Server converts it into Playwright actions.

Conceptually:
await page.goto("https://amazon.in");
await page.fill("#twotabsearchtextbox", "PlayStation 5");
await page.click("#nav-search-submit-button");

Step 5: Playwright Driver Executes Commands

The MCP Server does not interact with the browser directly.

MCP Server
     │
     ▼
Playwright Driver

The Playwright Driver sends protocol messages to the browser.

Example:

goto()
fill()
click()

Step 6: Browser Executes the Action

Playwright Driver
       │
       ▼
Chromium Browser
       │
       ▼
Blink Engine

The Blink Engine renders the page and performs the actual user actions.

Step 7: Response Travels Back

After execution:

Browser
    │
    ▼
Playwright Driver
    │
    ▼
Playwright MCP Server
    │
    ▼
GitHub Copilot (MCP Client)
    │
    ▼
AI Model
    │
    ▼
User

Complete Communication Flow
===========================
 
 QA Engineer
    │
    ▼
Prompt

    │
    ▼
AI Model
(GPT / Claude / Gemini)

    │
    ▼
GitHub Copilot
(MCP Client)

    │
    ▼
Playwright MCP Server

    │
    ▼
Playwright Driver

    │
    ▼
Browser Process
(Chromium)

    │
    ▼
Browser Engine
(Blink)

    │
    ▼
Web Application


Playwright Agent --> It is mandatory for PW MCP server up and running
================
🎭 planner - explores the app and produces a Markdown test plan
🎭 generator - transforms the Markdown plan into the Playwright Test files
🎭 healer - executes the test suite and automatically repairs failing tests

Planner Agent
-------------
User Prompt --> Planner Agent --> Browser tool explore the application --> Page Information is returned to the moodel -->
Model Identifies the possible test scenarios --> It will create a .md (Mark Down) file.

Generator Agent
---------------
.md file --> Generator Agent --> AI interprets steps --> Browser tool inspect UI Elements --> Locators and Actions -->
Typescript test generation --> login.spec.ts

Healer Agent
-----------
Failed login.spec.ts --> Healer Agent --> Reproduce failure --> It will identify the page state --> Analyze the failure -->
Possible Fix --> Update Test code --> Re-Run Test --> Review Test Result


 */
