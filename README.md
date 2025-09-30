# NexusHR

An innovative AI-powered HR companion agent designed to support employees throughout their entire journey with the company.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raymondhocc/HR-Companion-Agent-20250930-052137)

NexusHR is a sophisticated AI-powered companion designed to streamline the employee experience from onboarding to offboarding. It acts as a centralized, intelligent point of contact for all HR-related needs. The core of the application is an intuitive chat interface where employees can get instant answers to policy questions, initiate HR processes, and provide feedback. The system leverages the power of Cloudflare Agents and advanced AI models to understand context, use tools for specific tasks (like starting an onboarding checklist or checking vacation balances), and maintain persistent, secure conversations. The minimalist, clean user interface ensures a frictionless and pleasant user experience, promoting employee engagement and improving overall HR operational efficiency.

## Key Features

- **Intuitive Chat Interface**: A modern, clean messaging interface for all HR interactions.
- **AI-Powered Assistance**: Get instant, context-aware answers to HR policy questions.
- **HR Process Automation**: Initiate key workflows like onboarding or PTO requests directly from the chat.
- **Persistent Conversations**: Securely stored conversation history managed via a sidebar.
- **Extensible Tooling**: The AI agent can use predefined tools to fetch data or perform actions (e.g., check vacation balance).
- **Stateful Backend**: Built on Cloudflare Agents and Durable Objects for robust, persistent chat sessions.
- **Multi-Model Support**: Integrates with various large language models via Cloudflare AI Gateway.

## Technology Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Backend**: Cloudflare Workers, Hono
- **Persistence**: Cloudflare Agents (Durable Objects)
- **AI Integration**: Cloudflare AI Gateway, OpenAI SDK

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or later recommended)
- [Bun](https://bun.sh/) package manager
- [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/nexushr_ai_companion.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd nexushr_ai_companion
    ```
3.  **Install dependencies:**
    ```sh
    bun install
    ```

### Configuration

The application requires Cloudflare AI Gateway credentials to function.

1.  **Create a `.dev.vars` file** in the root of the project for local development:
    ```sh
    touch .dev.vars
    ```
2.  **Add your Cloudflare credentials** to the `.dev.vars` file. Replace the placeholder values with your actual credentials.
    ```ini
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="YOUR_CLOUDFLARE_API_KEY"
    ```

> **IMPORTANT SECURITY NOTICE**
>
> This project integrates with AI services that require API keys. For security reasons, the live demo deployed via the "Deploy to Cloudflare" button does not have API keys configured. AI features will not work in the demo.
>
> To enable AI capabilities, you must clone this repository, add your own API keys as described in the configuration steps, and deploy the project yourself.

## Development

To run the application locally, you need to start both the frontend Vite server and the backend Cloudflare Worker.

1.  **Start the backend worker:**
    Open a terminal and run:
    ```sh
    bun wrangler dev
    ```
    This will start the Hono backend server, typically on port `8787`.

2.  **Start the frontend development server:**
    Open a second terminal and run:
    ```sh
    bun dev
    ```
    This will start the Vite development server, typically on port `3000`. The frontend is configured to proxy API requests (`/api/*`) to the backend worker.

3.  **Open the application:**
    Open your browser and navigate to `http://localhost:3000`.

## Usage

- **Start a Conversation**: Type a message in the input box at the bottom of the chat view and press Enter or click the send button.
- **Suggested Prompts**: Use the suggested prompts on the welcome screen to explore the agent's capabilities.
- **Manage Sessions**:
    - A new chat session is created automatically.
    - Click on sessions in the left sidebar to switch between conversations.
    - Use the "New Chat" button to start a fresh conversation.

## Deployment

This project is designed for easy deployment to Cloudflare's global network.

1.  **Login to Wrangler:**
    If you haven't already, authenticate Wrangler with your Cloudflare account:
    ```sh
    bun wrangler login
    ```

2.  **Configure Secrets:**
    For your deployed application, you must set the AI Gateway credentials as secrets in your Cloudflare dashboard or via the command line.
    ```sh
    bun wrangler secret put CF_AI_BASE_URL
    bun wrangler secret put CF_AI_API_KEY
    ```
    You will be prompted to enter the secret values.

3.  **Deploy the application:**
    Run the deploy script:
    ```sh
    bun run deploy
    ```
    This command will build the frontend application, then deploy both the static assets and the worker to your Cloudflare account. You will be provided with a URL for your deployed application.

Alternatively, you can deploy directly from GitHub with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raymondhocc/HR-Companion-Agent-20250930-052137)