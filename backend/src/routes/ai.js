const express = require('express');
const router = express.Router();

// AI Assistant endpoint for ChatGPT integration
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // Return demo response if no API key
      const demoResponse = getDemoAIResponse(message, context);
      return res.json({
        success: true,
        response: demoResponse,
        mode: 'demo'
      });
    }

    // Make request to OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a business management AI assistant for AI Manager system. You help with:
            - Employee management and HR insights
            - Inventory optimization and stock management
            - Project planning and progress tracking
            - Financial analysis and budget optimization
            - Business operations and efficiency improvements
            
            Provide practical, actionable advice for business operations. Keep responses concise but helpful.
            When suggesting actions, be specific about implementation steps.`
          },
          ...(context ? [{
            role: 'system',
            content: `Current business context: ${context}`
          }] : []),
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const data = await openaiResponse.json();
    const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I could not generate a response at this time.';

    res.json({
      success: true,
      response: aiResponse,
      mode: 'ai',
      usage: data.usage
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    
    // Fallback to demo response on error
    const demoResponse = getDemoAIResponse(req.body.message, req.body.context);
    res.json({
      success: true,
      response: demoResponse,
      mode: 'demo_fallback',
      error: error.message
    });
  }
});

// Generate business suggestions
router.post('/suggestions', (req, res) => {
  try {
    const { dashboardData } = req.body;
    const suggestions = generateBusinessSuggestions(dashboardData);
    
    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate suggestions'
    });
  }
});

// Demo AI response function
function getDemoAIResponse(message, context) {
  const lowerMessage = message.toLowerCase();

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

  if (lowerMessage.includes('analysis') || lowerMessage.includes('performance') || lowerMessage.includes('improve')) {
    return `Comprehensive business analysis:

**Strengths:**
• Strong financial performance with healthy profit margins
• Active project pipeline with good completion rates
• Stable employee base with good retention
• Well-managed inventory with minimal waste

**Opportunities:**
• Automate routine tasks to improve efficiency
• Expand into complementary service areas
• Implement data analytics for better decision making
• Develop employee skills through training programs

**Immediate Actions:**
• Address any low stock inventory items
• Review project timelines for optimization
• Plan next quarter's financial targets
• Schedule team performance reviews

What specific area would you like me to analyze in more detail?`;
  }

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

// Generate business suggestions based on dashboard data
function generateBusinessSuggestions(dashboardData) {
  const suggestions = [];

  if (dashboardData?.employees?.total > 0) {
    const activeRate = (dashboardData.employees.active / dashboardData.employees.total) * 100;
    if (activeRate < 90) {
      suggestions.push("Review inactive employees and consider re-engagement strategies");
    }
    suggestions.push("Schedule quarterly performance reviews to maintain team productivity");
  }

  if (dashboardData?.inventory?.lowStockItems > 0) {
    suggestions.push(`Address ${dashboardData.inventory.lowStockItems} low stock items immediately`);
  }
  if (dashboardData?.inventory?.outOfStockItems > 0) {
    suggestions.push(`Critical: ${dashboardData.inventory.outOfStockItems} items are out of stock`);
  }

  if (dashboardData?.projects?.active > 0) {
    suggestions.push("Review active project timelines and resource allocation");
    const budgetUtilization = (dashboardData.projects.totalSpent / dashboardData.projects.totalBudget) * 100;
    if (budgetUtilization > 80) {
      suggestions.push("Monitor project budgets closely - utilization above 80%");
    }
  }

  if (dashboardData?.finances?.profit?.monthly > 0) {
    suggestions.push("Consider reinvesting profits into growth initiatives");
  }

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

module.exports = router;