// @ts-nocheck
import type {
  SubscriberConfig,
  SubscriberArgs,
} from "@medusajs/framework";
import { syncProductToSearchWorkflow } from "../workflows/sync-product-to-search";

export default async function productSearchSyncHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger");

  try {
    logger.info(
      `[ProductSearchSync] Syncing product ${data.id} to Meilisearch`
    );

    // Execute the workflow to sync product to search
    await syncProductToSearchWorkflow(container).run({
      input: {
        productId: data.id,
      },
    });

    logger.info(
      `[ProductSearchSync] Successfully synced product ${data.id} to Meilisearch`
    );
  } catch (error) {
    logger.error(
      `[ProductSearchSync] Failed to sync product ${data.id} to Meilisearch:`,
      error
    );
    // Don't throw - we don't want to fail the main product operation
    // Search sync can be retried or fixed later
  }
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated"],
};
