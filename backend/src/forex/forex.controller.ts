import { Controller, Get } from "@nestjs/common";
import axios from "axios";

@Controller("forex")
export class ForexController {
  @Get("prices")
  async getPrices() {
    // Pairs we care about
    const pairs = [
      "EUR/USD",
      "USD/JPY",
      "GBP/USD",
      "AUD/USD",
      "USD/CHF",
      "USD/CAD",
      "NZD/USD",
      "XAU/USD",
    ];

    // Using exchangerate-api.com free tier (no key required for basic usage)
    const base = "USD";
    const url = `https://api.exchangerate-api.com/v4/latest/${base}`;

    const res = await axios.get(url);
    const rates = res.data?.rates || {};

    // Map into your desired structure (quote as xxx/USD)
    const result = pairs.map((p) => {
      const [baseCur, quoteCur] = p.split("/");
      let price: number | null = null;

      if (p === "XAU/USD") {
        // we requested symbols includes XAU, base=USD
        // API gives: 1 USD = rate["XAU"] (XAU per USD)
        // So XAU/USD ≈ 1 / rate["XAU"]
        const r = rates["XAU"];
        price = r ? Number((1 / r).toFixed(2)) : null; // 2 decimals is enough for gold
      } else if (quoteCur === "USD") {
        // EUR/USD, GBP/USD, AUD/USD, NZD/USD
        const r = rates[baseCur];
        price = r ? Number((1 / r).toFixed(5)) : null;
      } else if (baseCur === "USD") {
        // USD/JPY, USD/CHF, USD/CAD
        const r = rates[quoteCur];
        price = r ? Number(r.toFixed(5)) : null;
      }

      return {
        pair: p,
        price: price !== null ? price : null,
      };
    });

    return {
      base,
      timestamp: res.data?.date || new Date().toISOString().split('T')[0],
      prices: result,
    };
  }
}

