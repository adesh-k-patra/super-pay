import swiggImage from "@assets/stock_images/swiggy_food_delivery_ab84875d.jpg";
import zomatoImage from "@assets/stock_images/zomato_food_brand_lo_7bd43c48.jpg";
import uberImage from "@assets/stock_images/uber_ride_sharing_lo_09bd2960.jpg";
import amazonImage from "@assets/stock_images/amazon_brand_logo_50e95bf2.jpg";
import flipkartImage from "@assets/stock_images/flipkart_ecommerce_l_f725436e.jpg";
import myntraImage from "@assets/stock_images/myntra_fashion_brand_d78778e5.jpg";
import foodImage from "@assets/stock_images/indian_food_butter_c_2b560b7a.jpg";
import shoppingImage from "@assets/stock_images/electronics_gadgets__014701a5.jpg";
import beautyImage from "@assets/stock_images/beauty_cosmetics_ski_043380f5.jpg";
import groceryImage from "@assets/stock_images/grocery_store_fresh__26c84fa0.jpg";

export const brandImageMap: Record<string, string> = {
  swiggy: swiggImage,
  zomato: zomatoImage,
  uber: uberImage,
  amazon: amazonImage,
  flipkart: flipkartImage,
  myntra: myntraImage,
  food: foodImage,
  shopping: shoppingImage,
  beauty: beautyImage,
  grocery: groceryImage,
};

export function getBrandImage(brandName: string, category?: string): string | null {
  const normalizedBrand = brandName.toLowerCase().trim();
  
  if (brandImageMap[normalizedBrand]) {
    return brandImageMap[normalizedBrand];
  }
  
  for (const [key, value] of Object.entries(brandImageMap)) {
    if (normalizedBrand.includes(key) || key.includes(normalizedBrand)) {
      return value;
    }
  }
  
  if (category) {
    const normalizedCategory = category.toLowerCase().trim();
    if (brandImageMap[normalizedCategory]) {
      return brandImageMap[normalizedCategory];
    }
  }
  
  return foodImage;
}
