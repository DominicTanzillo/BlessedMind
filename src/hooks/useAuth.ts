import { useState, useCallback, useEffect } from 'react'

const PASSWORD_HASH = import.meta.env.VITE_APP_PASSWORD_HASH as string

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (sessionStorage.getItem('bm_auth') === 'true') {
      setAuthenticated(true)
    }
  }, [])

  const login = useCallback(async (password: string) => {
    setError('')
    const hash = await hashPassword(password)
    if (hash === PASSWORD_HASH) {
      sessionStorage.setItem('bm_auth', 'true')
      setAuthenticated(true)
      return true
    }
    setError('Incorrect password')
    return false
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('bm_auth')
    setAuthenticated(false)
  }, [])

  return { authenticated, login, logout, error }
}
