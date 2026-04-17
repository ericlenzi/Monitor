import axios from 'axios'
import { API_BASE_URL, API_KEY } from '@/config/env'

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'X-API-KEY': API_KEY },
})

export default client
