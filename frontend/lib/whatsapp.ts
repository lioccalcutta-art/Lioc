import { SITE_CONFIG } from "./config";

export type WhatsAppContext =
  | "general"
  | "product"
  | "quote"
  | "sample"
  | "distributor"
  | "urgent_bulk";

interface WhatsAppOptions {
  context?: WhatsAppContext;
  productName?: string;
  sku?: string;
  industry?: string;
  customMessage?: string;
  source?: string;
}

export function getWhatsAppUrl(options: WhatsAppOptions = {}): string {
  const number = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  let message = "";

  if (options.customMessage) {
    message = options.customMessage;
  } else {
    switch (options.context) {
      case "product":
        message = `Hello Lioc Team, I am interested in *${options.productName || "your commercial cleaning products"}*${
          options.sku ? ` (SKU: ${options.sku})` : ""
        }. Please share bulk pricing and specifications.`;
        break;

      case "quote":
        message = `Hello Lioc Sales, I would like to request a bulk wholesale quotation for our facility in Kolkata / Eastern region.`;
        break;

      case "sample":
        message = `Hello Lioc, I would like to request an evaluation sample kit for *${options.productName || "our business facility"}*.`;
        break;

      case "distributor":
        message = `Hello Lioc Management, I am interested in becoming an authorized distributor / dealer for Lioc hygiene products. Please share dealership criteria.`;
        break;

      case "urgent_bulk":
        message = `Hello Lioc Express Dispatch, I have an urgent commercial cleaning requirement and need immediate assistance.`;
        break;

      case "general":
      default:
        message = `Hello Lioc, I visited your website and would like to know more about your commercial cleaning and hygiene products.`;
        break;
    }
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encodedMessage}`;
}
