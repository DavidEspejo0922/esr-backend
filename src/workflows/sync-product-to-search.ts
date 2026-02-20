// @ts-nocheck
import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { MeiliSearch } from "meilisearch";

type SyncProductToSearchInput = {
  productId: string;
};

type ProductData = {
  id: string;
  title: string;
  description: string;
  handle: string;
  status: string;
  thumbnail: string | null;
  variants: Array<{
    id: string;
    title: string;
    sku: string | null;
    prices: Array<{
      amount: number;
      currency_code: string;
    }>;
  }>;
  categories: Array<{
    id: string;
    name: string;
    handle: string;
  }>;
  tags: Array<{
    id: string;
    value: string;
  }>;
};

// Step 1: Retrieve product details
const retrieveProductStep = createStep(
  "retrieve-product-details",
  async ({ productId }: { productId: string }, { container }) => {
    const productModuleService = container.resolve("productModuleService");

    const product = await productModuleService.retrieveProduct(productId, {
      relations: ["variants", "variants.prices", "categories", "tags"],
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    return new StepResponse(product);
  }
);

// Step 2: Index product to Meilisearch
const indexProductToMeilisearchStep = createStep(
  "index-product-to-meilisearch",
  async ({ product }: { product: ProductData }) => {
    const meilisearchHost =
      process.env.MEILISEARCH_HOST || "http://localhost:7700";
    const meilisearchApiKey = process.env.MEILISEARCH_API_KEY || "";

    const client = new MeiliSearch({
      host: meilisearchHost,
      apiKey: meilisearchApiKey,
    });

    const index = client.index("products");

    // Transform product data for search indexing
    const searchDocument = {
      id: product.id,
      title: product.title,
      description: product.description || "",
      handle: product.handle,
      status: product.status,
      thumbnail: product.thumbnail,
      variants: product.variants?.map((variant) => ({
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        prices: variant.prices?.map((price) => ({
          amount: price.amount,
          currency_code: price.currency_code,
        })) || [],
      })) || [],
      categories: product.categories?.map((category) => ({
        id: category.id,
        name: category.name,
        handle: category.handle,
      })) || [],
      tags: product.tags?.map((tag) => ({
        id: tag.id,
        value: tag.value,
      })) || [],
      // Flatten for better searchability
      category_names: product.categories?.map((c) => c.name) || [],
      tag_values: product.tags?.map((t) => t.value) || [],
    };

    // Add or update document in Meilisearch
    const task = await index.addDocuments([searchDocument], {
      primaryKey: "id",
    });

    return new StepResponse(
      { taskUid: task.taskUid, productId: product.id },
      { taskUid: task.taskUid }
    );
  },
  async ({ taskUid }, { container }) => {
    // Compensation: In case of rollback, we could delete the document
    // For now, we'll just log it as search index inconsistency is acceptable
    console.log(
      `Rollback: Would remove product from search index (task: ${taskUid})`
    );
  }
);

// Define the workflow
export const syncProductToSearchWorkflow = createWorkflow(
  "sync-product-to-search",
  (input: SyncProductToSearchInput) => {
    const product = retrieveProductStep({ productId: input.productId });
    const result = indexProductToMeilisearchStep({ product });

    return new WorkflowResponse(result);
  }
);
