# Crypto Price Tracker AI Agent

An intelligent cryptocurrency price tracking agent built with Mastra and integrated with Telex.im using the A2A protocol. Get real-time crypto market data through natural language conversations.

## ✨ Features

- 💰 **Real-time Price Data** - Current prices for any cryptocurrency
- 📊 **Market Statistics** - Market cap, 24h volume, circulating supply
- 📈 **Price Changes** - 24h price movements with percentage changes
- 🔼 **High/Low Tracking** - Daily price ranges
- 🤖 **Natural Language Interface** - Ask in plain English
- 🔄 **A2A Protocol** - Seamless Telex.im integration

## 🎯 Use Cases

- Quick crypto price checks without leaving your chat
- Track multiple cryptocurrencies in one conversation
- Monitor market movements and trends
- Get comprehensive market data on-demand

## 🛠️ Tech Stack

- **Framework:** [Mastra](https://mastra.ai) v0.17.7
- **Language:** TypeScript
- **API:** [CoinGecko API](https://www.coingecko.com/en/api)
- **Protocol:** A2A (Agent-to-Agent)
- **Platform:** [Telex.im](https://telex.im)
- **Deployment:** Mastra Cloud
- **Storage:** LibSQL (in-memory)
- **Logging:** Pino Logger

## 📋 Prerequisites

- Node.js 18+ and npm
- CoinGecko API key
- Telex.im account with organization access

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/elijaharhinful/crypto-price-tracker.git
cd crypto-price-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Duplicate `.env.example` file in the root directory and edit it with the right information.

Get your CoinGecko API key from: https://www.coingecko.com/en/api
Get your Google Gemini API key from: https://aistudio.google.com/app/api-keys

### 4. Run Locally

```bash
npm run dev
```

The server will start at:
- **Playground:** http://localhost:4111/
- **API:** http://localhost:4111/api

### 5. Test the Agent

#### Using the Mastra Playground
1. Open http://localhost:4111/
2. Select `cryptoAgent`
3. Ask: "What's the price of Bitcoin?"

#### Using Postman

**Endpoint:** `POST http://localhost:4111/a2a/agent/cryptoAgent`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "jsonrpc": "2.0",
  "id": "test-123",
  "method": "message/send",
  "params": {
    "message": {
      "kind": "message",
      "role": "user",
      "parts": [
        {
          "kind": "text",
          "text": "What's the price of Bitcoin?"
        }
      ],
      "messageId": "msg-001"
    }
  }
}
```

## 📁 Project Structure

## 🔧 Configuration

### Supported Cryptocurrencies

The agent supports any cryptocurrency available on CoinGecko. Common examples:
- Bitcoin (BTC, bitcoin)
- Ethereum (ETH, ethereum)
- Binance Coin (BNB, binancecoin)
- Solana (SOL, solana)
- Cardano (ADA, cardano)
- XRP (ripple)
- Dogecoin (DOGE, dogecoin)
- Polkadot (DOT, polkadot)
- Polygon (MATIC, polygon)

## 🚢 Deployment

### Deploy to Mastra Cloud

1. **Connect Repository**
   - Go to https://cloud.mastra.ai
   - Connect your GitHub repository
   - Configure environment variables

2. **Deploy**
   - Mastra Cloud automatically builds and deploys
   - Get your production URL: `https://your-project.mastra.cloud`

3. **Update Telex Workflow**
   - Replace the URL in your workflow JSON with your production URL

## 📊 API Response Format

### Successful Response

```json
{
  "jsonrpc": "2.0",
  "id": "request-id",
  "result": {
    "id": "task-id",
    "contextId": "context-id",
    "status": {
      "state": "completed",
      "timestamp": "2025-11-01T12:00:00.000Z",
      "message": {
        "messageId": "msg-id",
        "role": "agent",
        "parts": [
          {
            "kind": "text",
            "text": "Bitcoin (BTC)\n💰 Price: $45,234.56\n📊 Market Cap: $884.5B..."
          }
        ]
      }
    },
    "artifacts": [...],
    "history": [...]
  }
}
```

### Error Response

```json
{
  "jsonrpc": "2.0",
  "id": "request-id",
  "error": {
    "code": -32603,
    "message": "Internal error",
    "data": { "details": "..." }
  }
}
```
## 🌐 Telex.im Integration

### 1. Get Telex Access

You can use anda telex invitation link to an organisation workspace or you can crate an account and your own workspace on https://telex.im 

### 2. Co-worker Creation

Create a telex co-worker by clicking "create new", fill and submit the popup form to create the co-worker.

### 3. Workflow Configuration

Click on your agent > click on view profile > click on configure workflow > Go to task list > click on view task list > click on JSON.

Create a workflow on Telex.im with this JSON:

```json
{
  "active": true,
  "category": "finance",
  "description": "Real-time cryptocurrency price tracker",
  "id": "crypto_price_tracker_001",
  "name": "crypto_price_tracker",
  "nodes": [
    {
      "id": "crypto_agent",
      "name": "Crypto Price Agent",
      "type": "a2a/mastra-a2a-node",
      "url": "<Your-Deployed-A2A-Agent-URL-on-Mastra-Cloud>/a2a/agent/cryptoAgent",
      "position": [500, 200]
    }
  ],
  "short_description": "Get real-time crypto prices and market data"
}
```

### 3. View Agent Logs

```
https://api.telex.im/agent-logs/{channel-id}.txt
```

Get your channel ID from the Telex URL when testing the agent.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

**⭐ If you found this project helpful, please star the repository!**