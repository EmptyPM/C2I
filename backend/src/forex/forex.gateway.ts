import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server } from "socket.io";
import axios from "axios";

type FxPair = "EUR/USD" | "USD/JPY" | "GBP/USD" | "AUD/USD" | "USD/CHF" | "USD/CAD" | "NZD/USD" | "XAU/USD";

interface ForexPrice {
  pair: FxPair;
  price: number | null;
}

interface ForexPayload {
  base: string;
  timestamp: string;
  prices: ForexPrice[];
  sequence?: number;
}

@WebSocketGateway({
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
})
export class ForexGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger("ForexGateway");
  private intervalId: NodeJS.Timeout | null = null;

  afterInit(server: Server) {
    this.server = server;
    this.logger.log("Forex WebSocket Gateway initialized");
    this.logger.log(`WebSocket server ready on port ${process.env.PORT || 4000}`);
    // Start price stream
    this.startPriceStream();
  }

  handleConnection(client: any) {
    this.logger.log(`Client connected: ${client.id} from ${client.handshake.address}`);
    // Send initial price update when client connects
    this.fetchForexPrices()
      .then((payload) => {
        if (client && client.connected) {
          client.emit("forex:update", payload);
          this.logger.log(`Sent initial prices to client ${client.id}`);
        }
      })
      .catch((err) => {
        this.logger.error("Failed to send initial prices to client", err);
      });
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private startPriceStream() {
    if (this.intervalId) return;

    this.logger.log("Starting forex price stream (updates every 2 seconds)");

    // Fetch + broadcast every 2 seconds
    // Also send immediately on start
    this.fetchAndBroadcast();
    
    this.intervalId = setInterval(() => {
      this.fetchAndBroadcast();
    }, 2_000);
  }

  private async fetchAndBroadcast() {
    try {
      const payload = await this.fetchForexPrices();
      if (this.server) {
        const clientCount = this.server.sockets.sockets.size;
        // Use emit to all connected clients
        this.server.emit("forex:update", payload);
        this.logger.debug(`Broadcasted forex prices to ${clientCount} client(s) at ${new Date().toISOString()}`);
      } else {
        this.logger.warn("Server not initialized, skipping broadcast");
      }
    } catch (err) {
      this.logger.error("Failed to fetch/broadcast forex prices", err as any);
    }
  }

  private async fetchForexPrices(): Promise<ForexPayload> {
    const base = "USD";
    // Using exchangerate-api.com free tier (no key required)
    // Add cache-busting timestamp to ensure fresh data
    const timestampParam = Date.now();
    const url = `https://api.exchangerate-api.com/v4/latest/${base}?t=${timestampParam}`;

    const res = await axios.get(url, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });
    const rates = res.data?.rates || {};
    // Use current timestamp instead of API date for real-time feel
    const timestamp = new Date().toISOString();

    const pairs: FxPair[] = [
      "EUR/USD",
      "USD/JPY",
      "GBP/USD",
      "AUD/USD",
      "USD/CHF",
      "USD/CAD",
      "NZD/USD",
      "XAU/USD",
    ];

    const prices: ForexPrice[] = pairs.map((p) => {
      const [baseCur, quoteCur] = p.split("/") as [string, string];
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

      return { pair: p as FxPair, price };
    });

    // Add a sequence number to ensure each update is unique
    return {
      base,
      timestamp,
      prices,
      sequence: Date.now(), // Unique identifier for each update
    };
  }
}

