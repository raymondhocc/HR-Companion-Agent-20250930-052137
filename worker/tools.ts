import type { WeatherResult, ErrorResult } from './types';
import { mcpManager } from './mcp-client';
export type ToolResult = WeatherResult | { content: string } | ErrorResult | Record<string, unknown>;
interface SerpApiResponse {
  knowledge_graph?: { title?: string; description?: string; source?: { link?: string } };
  answer_box?: { answer?: string; snippet?: string; title?: string; link?: string };
  organic_results?: Array<{ title?: string; link?: string; snippet?: string }>;
  local_results?: Array<{ title?: string; address?: string; phone?: string; rating?: number }>;
  error?: string;
}
const customTools = [
  {
    type: 'function' as const,
    function: {
      name: 'start_onboarding_process',
      description: 'Initiates the onboarding process for a new employee.',
      parameters: {
        type: 'object',
        properties: {
          employee_name: { type: 'string', description: 'The full name of the new employee.' },
          start_date: { type: 'string', description: 'The employee\'s start date in YYYY-MM-DD format.' },
        },
        required: ['employee_name', 'start_date'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'request_pto_balance',
      description: 'Retrieves the paid time off (PTO) balance for the current employee.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'find_policy_document',
      description: 'Finds and returns a link to a specific company policy document.',
      parameters: {
        type: 'object',
        properties: {
          policy_name: { type: 'string', description: 'The name or topic of the policy document to find (e.g., "remote work", "expense").' },
        },
        required: ['policy_name'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_weather',
      description: 'Get current weather information for a location',
      parameters: {
        type: 'object',
        properties: { location: { type: 'string', description: 'The city or location name' } },
        required: ['location']
      }
    }
  },
];
export async function getToolDefinitions() {
  const mcpTools = await mcpManager.getToolDefinitions();
  return [...customTools, ...mcpTools];
}
export async function executeTool(name: string, args: Record<string, unknown>): Promise<ToolResult> {
  try {
    switch (name) {
      case 'start_onboarding_process': {
        const employeeName = args.employee_name as string;
        const startDate = args.start_date as string;
        return {
          status: 'success',
          message: `Onboarding process initiated for ${employeeName}, starting on ${startDate}.`,
          onboarding_id: `ONB-${Math.floor(Math.random() * 9000) + 1000}`,
          ui_component: 'onboarding_checklist',
          employee_name: employeeName,
          start_date: startDate,
          checklist: [
            { id: 'task_1', text: 'Complete new hire paperwork in HR portal', completed: false },
            { id: 'task_2', text: 'Set up company email and communication tools', completed: false },
            { id: 'task_3', text: 'Review the employee handbook', completed: false },
            { id: 'task_4', text: 'Schedule a 1-on-1 with your manager', completed: false },
            { id: 'task_5', text: 'Complete mandatory security training', completed: false },
          ],
        };
      }
      case 'request_pto_balance':
        return {
          employee_id: 'EMP-12345',
          pto_balance_hours: (Math.random() * 80 + 20).toFixed(1),
          accrual_rate_per_pay_period: 4.62,
        };
      case 'find_policy_document': {
        const policyName = (args.policy_name as string).toLowerCase();
        const policies: Record<string, { title: string, url: string }> = {
          'remote work': { title: 'Remote Work Policy', url: '/docs/remote-work-policy' },
          'expense': { title: 'Travel & Expense Policy', url: '/docs/expense-policy' },
          'code of conduct': { title: 'Code of Conduct', url: '/docs/code-of-conduct' },
        };
        const foundPolicy = Object.keys(policies).find(p => p.includes(policyName));
        if (foundPolicy) {
          return {
            status: 'found',
            document_title: policies[foundPolicy].title,
            document_url: policies[foundPolicy].url,
          };
        }
        return {
          status: 'not_found',
          message: `Sorry, I could not find a policy document related to "${args.policy_name}". Please try a different keyword.`,
        };
      }
      case 'get_weather':
        return {
          location: args.location as string,
          temperature: Math.floor(Math.random() * 40) - 10,
          condition: ['Sunny', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 100)
        };
      default: {
        const content = await mcpManager.executeTool(name, args);
        return { content };
      }
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}