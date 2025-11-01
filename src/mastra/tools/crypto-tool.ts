import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import axios from "axios";

// Interface for CoinGecko API response
interface CoinGeckoData {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    price_change_percentage_24h: number;
    high_24h: { usd: number };
    low_24h: { usd: number };
    total_volume: { usd: number };
    circulating_supply: number;
  };
}

export const cryptoTool = createTool({
  id: "get-crypto-price",
  description: "Get real-time cryptocurrency price data and market information",
  inputSchema: z.object({
    cryptocurrency: z.string().describe("Cryptocurrency name or symbol (e.g., bitcoin, BTC, ethereum, ETH)")
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.object({
      name: z.string(),
      symbol: z.string(),
      current_price: z.number(),
      market_cap: z.number(),
      price_change_24h: z.number(),
      price_change_percentage_24h: z.number(),
      high_24h: z.number(),
      low_24h: z.number(),
      volume_24h: z.number(),
      circulating_supply: z.number(),
    }).optional(),
    error: z.string().optional()
  }),
  execute: async ({ context }) => {
    try {
      const { cryptocurrency } = context;
      
      // Normalize input (convert to lowercase and handle common variations)
      const cryptoId = cryptocurrency.toLowerCase()
        .replace(/\s+/g, '-')
        .replace('btc', 'bitcoin')
        .replace('eth', 'ethereum')
        .replace('bnb', 'binancecoin')
        .replace('sol', 'solana')
        .replace('ada', 'cardano')
        .replace('xrp', 'ripple')
        .replace('doge', 'dogecoin')
        .replace('dot', 'polkadot')
        .replace('matic', 'polygon');

      // CoinGecko API endpoint
      const apiKey = process.env.COINGECKO_API_KEY;
      const baseUrl = 'https://api.coingecko.com/api/v3';
      
      const headers = apiKey ? { 'x-cg-demo-api-key': apiKey } : {};

      // Fetch crypto data
      const response = await axios.get<CoinGeckoData>(
        `${baseUrl}/coins/${cryptoId}`,
        {
          params: {
            localization: false,
            tickers: false,
            community_data: false,
            developer_data: false,
            sparkline: false
          },
          headers,
          timeout: 10000
        }
      );

      const data = response.data;

      return {
        success: true,
        data: {
          name: data.name,
          symbol: data.symbol.toUpperCase(),
          current_price: data.market_data.current_price.usd,
          market_cap: data.market_data.market_cap.usd,
          price_change_24h: data.market_data.price_change_percentage_24h,
          price_change_percentage_24h: data.market_data.price_change_percentage_24h,
          high_24h: data.market_data.high_24h.usd,
          low_24h: data.market_data.low_24h.usd,
          volume_24h: data.market_data.total_volume.usd,
          circulating_supply: data.market_data.circulating_supply,
        }
      };

    } catch (error: any) {
      console.error('Error fetching crypto data:', error.message);
      
      let errorMessage = 'Failed to fetch cryptocurrency data';
      
      if (error.response?.status === 404) {
        errorMessage = 'Cryptocurrency not found. Please check the name or symbol and try again.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }
});