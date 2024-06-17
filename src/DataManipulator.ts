import { ServerRespond } from "./DataStreamer";

export interface Row {
  price_ABC: number;
  price_DEF: number;
  ratio: number;
  timestamp: Date;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: number | undefined;
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    const priceABC =
      Number(serverResponds[0].top_ask) + Number(serverResponds[0].top_bid);
    const priceDEF =
      Number(serverResponds[1].top_ask) + Number(serverResponds[1].top_bid);
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
    return {
      price_ABC: priceABC,
      price_DEF: priceDEF,
      ratio,
      timestamp:
        serverResponds[0].timestamp > serverResponds[1].timestamp
          ? serverResponds[0].timestamp
          : serverResponds[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert:
        ratio > upperBound || ratio < lowerBound ? ratio : undefined,
    };
  }
}
