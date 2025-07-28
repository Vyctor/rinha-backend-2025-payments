import { config } from "dotenv";
import { Redis } from "ioredis";
import { CronJob } from "cron";
import axios from "axios";

config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// every 5 seconds
const job = new CronJob("*/5 * * * * *", async () => {
  const defaultGatewayStatus = await getPaymentGatewayStatus({
    gateway: "default",
  });
  const fallbackGatewayStatus = await getPaymentGatewayStatus({
    gateway: "fallback",
  });

  console.info("Default gateway status:", defaultGatewayStatus);
  console.info("Fallback gateway status:", fallbackGatewayStatus);

  if (defaultGatewayStatus.failing && fallbackGatewayStatus.failing) {
    console.info("Ambos os gateways estão falhando, requeue");
    await redis.setex("best-gateway", 10000, "requeue");
    return;
  }

  if (
    defaultGatewayStatus.failing === false &&
    defaultGatewayStatus.minResponseTime <=
      fallbackGatewayStatus.minResponseTime
  ) {
    console.info("Default gateway is faster than fallback, using default");
    await redis.setex("best-gateway", 10000, "default");
  } else {
    if (defaultGatewayStatus.minResponseTime <= 500) {
      console.info("Default gateway is better than fallback, using default");
      await redis.setex("best-gateway", 10000, "default");
    } else {
      console.info(
        "Fallback gateway is way faster than default, using fallback"
      );
      await redis.setex("best-gateway", 10000, "fallback");
    }
  }
});

job.start();

async function getPaymentGatewayStatus({ gateway }) {
  try {
    if (gateway === "default") {
      const response = await axios.get(
        process.env.PAYMENTS_DEFAULT_GATEWAY_URL + "/service-health"
      );
      return {
        ...response.data,
        gateway: "default",
      };
    } else {
      const response = await axios.get(
        process.env.PAYMENTS_FALLBACK_GATEWAY_URL + "/service-health"
      );
      return {
        ...response.data,
        gateway: "fallback",
      };
    }
  } catch {
    return {
      failing: true,
      minResponseTime: 9999,
      gateway: "requeue",
    };
  }
}
