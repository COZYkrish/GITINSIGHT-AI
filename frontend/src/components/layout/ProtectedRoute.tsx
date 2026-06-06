import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { ReactNode } from 'react'

interface ProtectedRouteProps { children: ReactNode }

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, token } = useAuthStore()
  if (!isAuthenticated && !token) return <Navigate to="/login" replace />
  return <>{children}</>
}
