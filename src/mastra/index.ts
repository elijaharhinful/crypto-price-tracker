import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { PinoLogger } from '@mastra/loggers';
import { cryptoAgent } from './agents/crypto-agent';
import { a2aAgentRoute } from './routes/a2a-agent-route';

export const mastra = new Mastra({
  agents: { cryptoAgent },
  storage: new LibSQLStore({ 
    url: ":memory:" 
  }),
  logger: new PinoLogger({
    name: 'CryptoPriceTracker',
    level: 'debug',
  }),
  observability: {
    default: { enabled: true },
  },
  server: {
    apiRoutes: [a2aAgentRoute]
  }
});