import { createClient as createContentfulClient } from "contentful";
import { EntrySkeletonType } from "contentful";

export interface ProductFieldsWithSys extends EntrySkeletonType {
  fields: {
    name: string;
    description?: string;
    price: number;
    availableQuantity: number;
    image?: {
      sys: {
        id: string;
        type: string;
      };
      fields: {
        title: string;
        description?: string;
        file: {
          url: string;
          details: {
            size: number;
            image?: {
              width: number;
              height: number;
            };
          };
          fileName: string;
          contentType: string;
        };
      };
    };
  };
  contentTypeId: "product";
}

export type ProductFields = ProductFieldsWithSys["fields"];

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  availableQuantity: number;
}

export function createClient() {
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

  console.log("Contentful Space ID:", spaceId);
  console.log(
    "Contentful Access Token:",
    accessToken ? "[REDACTED]" : "NOT SET"
  );

  if (!spaceId) {
    throw new Error("NEXT_PUBLIC_CONTENTFUL_SPACE_ID is not set");
  }

  if (!accessToken) {
    throw new Error("NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN is not set");
  }

  return createContentfulClient({
    space: spaceId,
    accessToken: accessToken,
  });
}

export async function fetchProducts(): Promise<Product[]> {
  const client = createClient();
  const response = await client.getEntries<ProductFieldsWithSys>({
    content_type: "product",
  });

  return response.items
    .map(
      (entry): Product => ({
        id: entry.sys.id,
        name: entry.fields.name || "Unnamed Product",
        price: entry.fields.price || 0,
        description: entry.fields.description || "",
        imageUrl: extractImageUrl(entry.fields),
        availableQuantity: entry.fields.availableQuantity || 0,
      })
    )
    .filter((product: Product) => product.availableQuantity > 0);
}

function extractImageUrl(item: ProductFieldsWithSys["fields"]): string {
  if (item.image && item.image.fields && item.image.fields.file) {
    const imageFile = item.image.fields.file;

    // Prefer WebP format if available
    if (imageFile.contentType === "image/webp") {
      return `https:${imageFile.url}`;
    }

    // Fallback to original image URL
    return `https:${imageFile.url}`;
  }
  return "/placeholder-image.png"; // Fallback image
}
