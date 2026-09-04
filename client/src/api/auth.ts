import apiClient from './client'
import type { AuthResponse } from '../types'

export interface Credentials {
  email: string
  password: string
}

export async function signup(credentials: Credentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/users/signup', credentials)
  return data
}

export async function login(credentials: Credentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/users/login', credentials)
  return data
}
