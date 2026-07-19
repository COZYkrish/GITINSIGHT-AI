import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { ReactNode } from 'react'

interface ProtectedRouteProps { children: ReactNode }

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, token } = useAuthStore()
  const location = useLocation()
  const hasUrlToken = new URLSearchParams(location.search).has('token')
  
  if (!isAuthenticated && !token && !hasUrlToken) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}
