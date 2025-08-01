import { API_ENDPOINTS } from '../constants/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

export class AuthViewModel {
  private static TOKEN_KEY = '@auth_token'
  private static REFRESH_TOKEN_KEY = '@refresh_token'

  async login(email: string, password: string) {
    try {
      // API call implementation
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      await this.saveTokens(data.token, data.refreshToken)
      return data
    } catch (error) {
      throw error
    }
  }

  async verify2FA(code: string) {
    try {
      // 2FA verification implementation
      const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_2FA, {
        method: 'POST',
        body: JSON.stringify({ code }),
      })
      return await response.json()
    } catch (error) {
      throw error
    }
  }

  private async saveTokens(token: string, refreshToken: string) {
    await AsyncStorage.setItem(AuthViewModel.TOKEN_KEY, token)
    await AsyncStorage.setItem(AuthViewModel.REFRESH_TOKEN_KEY, refreshToken)
  }

  async logout() {
    await AsyncStorage.multiRemove([
      AuthViewModel.TOKEN_KEY,
      AuthViewModel.REFRESH_TOKEN_KEY,
    ])
  }

  async isFirstLaunch(): Promise<boolean> {
    const value = await AsyncStorage.getItem('@first_launch')
    return value === null
  }

  async setFirstLaunchComplete() {
    await AsyncStorage.setItem('@first_launch', 'false')
  }
}
