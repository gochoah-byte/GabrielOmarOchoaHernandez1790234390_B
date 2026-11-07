import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { API_URL } from '../config'
import { useAuthStore } from '../store/authStore'
import { authService } from './authService'
type RetryConfig = InternalAxiosRequestConfig & {retried?:boolean}
let refreshing: ReturnType<typeof authService.refresh> | null = null
export const api = axios.create({baseURL:API_URL,timeout:15000})
api.interceptors.request.use(config => {
 const token = useAuthStore.getState().accessToken
 if (token) config.headers.set('Authorization', 'Bearer '+token)
 return config
})
api.interceptors.response.use(response => response, async (error:unknown) => {
 if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) return Promise.reject(error)
 const config = error.config as RetryConfig
 const {refreshToken,logout} = useAuthStore.getState()
 if(config.retried || !refreshToken) {
  logout(); window.location.replace('/login'); return Promise.reject(error)
 }
 config.retried = true
 try {
  if(!refreshing) refreshing = authService.refresh(refreshToken).then(tokens => {
   if(useAuthStore.getState().refreshToken !== refreshToken) throw new Error('La sesión ha cambiado')
   useAuthStore.getState().setTokens(tokens.accessToken,tokens.refreshToken)
   return tokens
  }).finally(() => {refreshing = null})
  const tokens = await refreshing
  config.headers.set('Authorization','Bearer '+tokens.accessToken)
  return api(config)
 } catch(refreshError) {
  logout(); window.location.replace('/login'); return Promise.reject(refreshError)
 }
})
