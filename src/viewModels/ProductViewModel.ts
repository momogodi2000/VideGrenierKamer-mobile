import { API_ENDPOINTS } from '../constants/api'

export class ProductViewModel {
  async getProducts(filters?: { price?: number; category?: string }) {
    try {
      const queryParams = new URLSearchParams(filters)
      const response = await fetch(`${API_ENDPOINTS.PRODUCTS.LIST}?${queryParams}`)
      return await response.json()
    } catch (error) {
      throw error
    }
  }

  async getProductDetails(id: string) {
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS.DETAIL(id))
      return await response.json()
    } catch (error) {
      throw error
    }
  }

  async addToCart(productId: string, quantity: number) {
    try {
      const response = await fetch(API_ENDPOINTS.VISITOR.ADD_TO_CART, {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      })
      return await response.json()
    } catch (error) {
      throw error
    }
  }
}
