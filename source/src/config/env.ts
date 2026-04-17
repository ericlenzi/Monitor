export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
export const API_KEY = import.meta.env.VITE_API_KEY as string

if (!API_BASE_URL) throw new Error('VITE_API_BASE_URL is not set')
if (!API_KEY) throw new Error('VITE_API_KEY is not set')
