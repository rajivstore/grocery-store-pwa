import "dotenv/config";
import { createClient } from "../lib/contentful.js";

async function testContentfulConnection() {
  try {
    console.log("Current Environment:", process.env.NODE_ENV);
    console.log("All Environment Variables:", Object.keys(process.env));

    const client = createClient();

    // Get the Product content type details
    const contentTypes = await client.getContentTypes();
    console.log("Available Content Types:", contentTypes.items.map(type => type.sys.id));

    const productContentType = contentTypes.items.find((type) => type.sys.id === "product");

    if (!productContentType) {
      console.error("Product content type not found. Available content types:", 
        contentTypes.items.map(type => type.sys.id)
      );
      return;
    }

    console.log("\nProduct Content Type Details:");
    console.log("Content Type Name:", productContentType.name);
    console.log("Content Type ID:", productContentType.sys.id);

    console.log("\nFields:");
    productContentType.fields.forEach((field) => {
      console.log(`- ${field.name} (${field.id}):`, {
        type: field.type,
        required: field.required,
        localized: field.localized,
      });
    });

    // Fetch products to see actual data structure
    const response = await client.getEntries({
      content_type: "product",
    });

    console.log("\nTotal Products:", response.items.length);

    response.items.forEach((item, index) => {
      console.log(`Product ${index + 1}:`, {
        name: item.fields.name,
        price: item.fields.price,
        availableQuantity: item.fields.availableQuantity,
      });
    });

    // Fetch a product to see actual data structure
    const singleResponse = await client.getEntries({
      content_type: "product",
      limit: 1,
    });

    if (singleResponse.items.length > 0) {
      const firstProduct = singleResponse.items[0];
      console.log("\nFirst Product Raw Data:");
      console.log(JSON.stringify(firstProduct, null, 2));
    }
  } catch (error) {
    console.error("Error in testContentfulConnection:", error);

    // Log environment variables for debugging
    console.log("Environment Variables:");
    console.log(
      "NEXT_PUBLIC_CONTENTFUL_SPACE_ID:",
      process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
    );
    console.log(
      "NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN:",
      process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN ? "[REDACTED]" : "NOT SET"
    );

    // If it's an error with a specific message, log that
    if (error instanceof Error) {
      console.error("Error Message:", error.message);
      console.error("Error Stack:", error.stack);
    }
  }
}

testContentfulConnection();
