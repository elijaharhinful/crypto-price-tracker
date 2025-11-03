import { registerApiRoute } from '@mastra/core/server';
import { randomUUID } from 'crypto';

export const a2aAgentRoute = registerApiRoute('/a2a/agent/:agentId', {
  method: 'POST',
  handler: async (c) => {
    try {
      const mastra = c.get('mastra');
      const agentId = c.req.param('agentId');
      
      // Parse JSON-RPC 2.0 request
      const body = await c.req.json();
      const { jsonrpc, id: requestId, method, params } = body;
      
      // Validate JSON-RPC 2.0 format
      if (!jsonrpc || jsonrpc !== '2.0') {
        return c.json({
          jsonrpc: '2.0',
          id: requestId || null,
          error: {
            code: -32600,
            message: 'Invalid Request: jsonrpc must be "2.0"'
          }
        }, 400);
      }
      
      // ID can be null or any value, but must be present
      if (requestId === undefined) {
        return c.json({
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32600,
            message: 'Invalid Request: id is required'
          }
        }, 400);
      }
      
      const agent = mastra.getAgent(agentId);
      if (!agent) {
        return c.json({
          jsonrpc: '2.0',
          id: requestId,
          error: {
            code: -32602,
            message: `Agent '${agentId}' not found`
          }
        }, 404);
      }
      
      // Extract messages from params (handle missing params gracefully)
      const { message, messages, contextId, taskId, metadata } = params || {};
      let messagesList: any[] = [];
      
      if (message) {
        messagesList = [message];
      } else if (messages && Array.isArray(messages)) {
        messagesList = messages;
      }
      
      // If no messages provided, create a default greeting
      if (messagesList.length === 0) {
        messagesList = [{
          role: 'user',
          parts: [{ kind: 'text', text: 'Hello' }],
          messageId: randomUUID()
        }];
      }
      
      // Convert A2A messages to Mastra format
      const mastraMessages = messagesList.map((msg: any) => {
        const parts = msg.parts || [];
        
        // Extract text part (index 0) - Telex's interpretation of user intent
        const textPart = parts.find((p: any) => p.kind === 'text')?.text || '';
        
        // Extract data part (conversation history) if needed
        const dataPart = parts.find((p: any) => p.kind === 'data');
        const historyContext = dataPart ? `\n\nContext: ${JSON.stringify(dataPart.data)}` : '';
        
        return {
          role: msg.role || 'user',
          content: textPart || 'Hello' // Default content if empty
        };
      });
      
      // Execute agent with error handling
      let response;
      try {
        response = await agent.generate(mastraMessages);
      } catch (genError: any) {
        console.error('Agent generation error:', genError);
        return c.json({
          jsonrpc: '2.0',
          id: requestId,
          error: {
            code: -32603,
            message: 'Agent execution failed',
            data: { details: genError.message }
          }
        }, 500);
      }
      
      const agentText = response.text || 'No response generated';
      
      // Build artifacts array - only include agent's formatted response
      const artifacts = [
        {
          artifactId: randomUUID(),
          name: `${agentId}Response`,
          parts: [{ kind: 'text', text: agentText }]
        }
      ];
            
      // Build conversation history
      const history = [
        ...messagesList.map((msg: any) => ({
          kind: 'message',
          role: msg.role || 'user',
          parts: msg.parts || [{ kind: 'text', text: 'Hello' }],
          messageId: msg.messageId || randomUUID(),
          taskId: msg.taskId || taskId || randomUUID(),
        })),
        {
          kind: 'message',
          role: 'agent',
          parts: [{ kind: 'text', text: agentText }],
          messageId: randomUUID(),
          taskId: taskId || randomUUID(),
        }
      ];
      
      // Return A2A-compliant response
      return c.json({
        jsonrpc: '2.0',
        id: requestId,
        result: {
          id: taskId || randomUUID(),
          contextId: contextId || randomUUID(),
          status: {
            state: 'completed',
            timestamp: new Date().toISOString(),
            message: {
              messageId: randomUUID(),
              role: 'agent',
              parts: [{ kind: 'text', text: agentText }],
              kind: 'message'
            }
          },
          artifacts,
          history,
          kind: 'task'
        }
      });
    } catch (error: any) {
      console.error('Route handler error:', error);
      return c.json({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32603,
          message: 'Internal error',
          data: { details: error.message }
        }
      }, 500);
    }
  }
});