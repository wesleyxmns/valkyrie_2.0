import { HttpStatus } from "@/lib/fetch/constants/http-status";
import { protheusAPI } from "@/lib/fetch/protheus-api";

type Product = {
  code: string;
  description: string;
  uom: string;
  type: string;
}

/**
 * @description Get product by code on Protheus API
 * @param code Code of the product to be searched
 * @returns Product object if found, null otherwise
 */
export async function getProduct(code: string): Promise<Product | null> {
  const response = await protheusAPI(`/product?product=${code}`);

  if (response.status === HttpStatus.OK) {
    const product: Product = await response.json();

    return product;
  }

  return null;
}