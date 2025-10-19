// AI Service for ChatGPT integration
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    // In production, this would come from environment variables
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  private getSystemPrompt(): string {
    return `You are a business management AI assistant for AI Manager system. You help with:
    - Employee management and HR insights
    - Inventory optimization and stock management
    - Project planning and progress tracking
    - Financial analysis and budget optimization
    - Business operations and efficiency improvements
    
    Provide practical, actionable advice for business operations. Keep responses concise but helpful.
    When suggesting actions, be specific about implementation steps.`;
  }

  async sendMessage(message: string, context?: string): Promise<string> {
    // If no API key is provided, return a demo response
    if (!this.apiKey) {
      return this.getDemoResponse(message, context);
    }

    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: this.getSystemPrompt()
        }
      ];

      if (context) {
        messages.push({
          role: 'system',
          content: `Current business context: ${context}`
        });
      }

      messages.push({
        role: 'user',
        content: message
      });

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: ChatCompletionResponse = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I could not generate a response at this time.';
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getDemoResponse(message, context);
    }
  }

  private getDemoResponse(message: string, context?: string): string {
    const lowerMessage = message.toLowerCase();

    // Business insights based on message content
    if (lowerMessage.includes('employee') || lowerMessage.includes('hr') || lowerMessage.includes('staff')) {
      return `Based on your employee data, I recommend focusing on:
      
      1. **Performance Reviews**: Schedule quarterly reviews to maintain engagement
      2. **Skills Development**: Consider training programs for IT and Operations teams
      3. **Retention Strategy**: Your active employee rate is good, but consider implementing mentorship programs
      4. **Workload Balance**: Monitor project assignments to prevent burnout
      
      Would you like me to help create a specific action plan for any of these areas?`;
    }

    if (lowerMessage.includes('inventory') || lowerMessage.includes('stock') || lowerMessage.includes('supply')) {
      return `Your inventory analysis suggests these optimizations:
      
      1. **Stock Alerts**: Set up automated reorder points for critical items
      2. **Supplier Relations**: Consider backup suppliers for high-value items
      3. **Seasonal Planning**: Adjust stock levels based on demand patterns
      4. **Cost Optimization**: Review pricing with suppliers quarterly
      
      Current low stock items need immediate attention. Should I help prioritize reorder actions?`;
    }

    if (lowerMessage.includes('project') || lowerMessage.includes('timeline') || lowerMessage.includes('budget')) {
      return `Project management insights for your current portfolio:
      
      1. **Budget Tracking**: Your projects are within budget range, maintain current monitoring
      2. **Resource Allocation**: Consider reallocating team members for better efficiency
      3. **Timeline Optimization**: Focus on milestone completion rates
      4. **Risk Management**: Identify potential bottlenecks early
      
      Would you like detailed analysis on any specific project?`;
    }

    if (lowerMessage.includes('finance') || lowerMessage.includes('revenue') || lowerMessage.includes('profit')) {
      return `Financial health analysis shows:
      
      1. **Cash Flow**: Maintain current positive trend with regular monitoring
      2. **Cost Control**: Review monthly expenses for optimization opportunities
      3. **Revenue Growth**: Consider expanding successful service lines
      4. **Investment Planning**: Allocate budget for technology upgrades
      
      Your profit margins are healthy. Shall I suggest specific growth strategies?`;
    }

    if (lowerMessage.includes('dashboard') || lowerMessage.includes('overview') || lowerMessage.includes('metrics')) {
      return `Your business dashboard indicates strong performance:
      
      1. **Key Metrics**: All major KPIs are trending positively
      2. **Department Health**: Operations and IT departments show excellent productivity
      3. **System Alerts**: Address low stock items and upcoming project deadlines
      4. **Growth Opportunities**: Focus on scaling successful initiatives
      
      What specific metrics would you like me to analyze in detail?`;
    }

    // Default comprehensive business advice
    return `I'm here to help optimize your business operations. Based on your current data:

    **Immediate Actions:**
    • Review inventory levels and reorder critical items
    • Update employee performance tracking
    • Monitor project timelines for potential delays
    • Analyze this month's financial performance

    **Strategic Recommendations:**
    • Implement automated alerts for low stock
    • Create employee development programs
    • Optimize project resource allocation
    • Plan for next quarter's budget cycle

    What specific area would you like me to focus on: Employees, Inventory, Projects, or Finance?`;
  }

  // Get business suggestions based on current data
  async getBusinessSuggestions(dashboardData: any): Promise<string[]> {
    const suggestions: string[] = [];

    // Employee suggestions
    if (dashboardData?.employees?.total > 0) {
      const activeRate = (dashboardData.employees.active / dashboardData.employees.total) * 100;
      if (activeRate < 90) {
        suggestions.push("Review inactive employees and consider re-engagement strategies");
      }
      suggestions.push("Schedule quarterly performance reviews to maintain team productivity");
    }

    // Inventory suggestions
    if (dashboardData?.inventory?.lowStockItems > 0) {
      suggestions.push(`Address ${dashboardData.inventory.lowStockItems} low stock items immediately`);
    }
    if (dashboardData?.inventory?.outOfStockItems > 0) {
      suggestions.push(`Critical: ${dashboardData.inventory.outOfStockItems} items are out of stock`);
    }

    // Project suggestions
    if (dashboardData?.projects?.active > 0) {
      suggestions.push("Review active project timelines and resource allocation");
      const budgetUtilization = (dashboardData.projects.totalSpent / dashboardData.projects.totalBudget) * 100;
      if (budgetUtilization > 80) {
        suggestions.push("Monitor project budgets closely - utilization above 80%");
      }
    }

    // Financial suggestions
    if (dashboardData?.finances?.profit?.monthly > 0) {
      suggestions.push("Consider reinvesting profits into growth initiatives");
    }

    // Default suggestions if no data
    if (suggestions.length === 0) {
      suggestions.push(
        "Set up automated inventory alerts for better stock management",
        "Implement employee feedback system for better engagement",
        "Create project milestone tracking for improved delivery",
        "Schedule monthly financial reviews for better insights"
      );
    }

    return suggestions;
  }
}

export const aiService = new AIService();
export default aiService;