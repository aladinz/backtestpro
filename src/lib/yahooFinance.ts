import yahooFinance from 'yahoo-finance2';

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: number;
  high52Week?: number;
  low52Week?: number;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicatorData {
  rsi: number;
  macd: number;
  sma20: number;
  sma50: number;
}

class YahooFinanceService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 60000; // 1 minute cache

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any {
    return this.cache.get(key)?.data;
  }

  /**
   * Get real-time quote for a single symbol
   */
  async getQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const cacheKey = `quote_${symbol}`;
      if (this.isCacheValid(cacheKey)) {
        return this.getCache(cacheKey);
      }

      const quote = await yahooFinance.quote(symbol);
      
      if (!quote || !quote.regularMarketPrice) {
        throw new Error(`No valid quote data received for ${symbol}`);
      }
      
      const result: StockQuote = {
        symbol: quote.symbol || symbol,
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        volume: quote.regularMarketVolume,
        marketCap: quote.marketCap,
        high52Week: quote.fiftyTwoWeekHigh,
        low52Week: quote.fiftyTwoWeekLow
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Get quotes for multiple symbols
   */
  async getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    try {
      const quotes = await Promise.allSettled(
        symbols.map(symbol => this.getQuote(symbol))
      );

      return quotes
        .map(result => result.status === 'fulfilled' ? result.value : null)
        .filter((quote): quote is StockQuote => quote !== null);
    } catch (error) {
      console.error('Error fetching multiple quotes:', error);
      return [];
    }
  }

  /**
   * Get historical data for a symbol
   */
  async getHistoricalData(
    symbol: string, 
    period1: string | Date, 
    period2: string | Date = new Date(),
    interval: '1d' | '1wk' | '1mo' = '1d'
  ): Promise<HistoricalData[]> {
    try {
      const cacheKey = `historical_${symbol}_${period1}_${period2}_${interval}`;
      if (this.isCacheValid(cacheKey)) {
        return this.getCache(cacheKey);
      }

      const historical = await yahooFinance.historical(symbol, {
        period1,
        period2,
        interval
      });

      const result = historical.map(bar => ({
        date: bar.date.toISOString().split('T')[0],
        open: bar.open,
        high: bar.high,
        low: bar.low,
        close: bar.close,
        volume: bar.volume
      }));

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Calculate RSI (Relative Strength Index)
   */
  calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 0;

    let gains = 0;
    let losses = 0;

    // Initial average gain and loss
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Calculate subsequent values
    for (let i = period + 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      const gain = change > 0 ? change : 0;
      const loss = change < 0 ? -change : 0;

      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
    }

    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  /**
   * Calculate Simple Moving Average
   */
  calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return 0;
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  /**
   * Get technical indicators for a symbol
   */
  async getTechnicalIndicators(symbol: string): Promise<TechnicalIndicatorData | null> {
    try {
      const historical = await this.getHistoricalData(
        symbol, 
        new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
        new Date()
      );

      if (historical.length < 50) return null;

      const closePrices = historical.map(bar => bar.close);
      
      return {
        rsi: this.calculateRSI(closePrices),
        macd: 0, // Simplified for now
        sma20: this.calculateSMA(closePrices, 20),
        sma50: this.calculateSMA(closePrices, 50)
      };
    } catch (error) {
      console.error(`Error calculating technical indicators for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Get market breadth data (major indices)
   */
  async getMarketBreadth(): Promise<{
    spyAdvanceDecline: number;
    vixLevel: number;
    marketSentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  }> {
    try {
      const [spy, vix] = await Promise.all([
        this.getQuote('SPY'),
        this.getQuote('^VIX')
      ]);

      const vixLevel = vix?.price || 20;
      const spyChange = spy?.changePercent || 0;

      let marketSentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
      if (vixLevel > 25 || spyChange < -1) {
        marketSentiment = 'BEARISH';
      } else if (vixLevel < 15 && spyChange > 1) {
        marketSentiment = 'BULLISH';
      }

      return {
        spyAdvanceDecline: spyChange,
        vixLevel,
        marketSentiment
      };
    } catch (error) {
      console.error('Error fetching market breadth:', error);
      return {
        spyAdvanceDecline: 0,
        vixLevel: 20,
        marketSentiment: 'NEUTRAL'
      };
    }
  }
}

export const yahooFinanceService = new YahooFinanceService();
