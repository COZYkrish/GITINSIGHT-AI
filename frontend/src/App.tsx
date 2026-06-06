import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, Suspense } from 'react'
import './index.css'

import { useAuthStore } from './store/authStore'
import { AuthLayout } from './components/layout/AuthLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'

// Public pages
import { LandingPage } from './pages/landing/LandingPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'

// Onboarding
import { WelcomePage } from './pages/onboarding/WelcomePage'
import { ConnectGitHubPage } from './pages/onboarding/ConnectGitHubPage'
import { RepositorySyncPage } from './pages/onboarding/RepositorySyncPage'

// Dashboard
import { DashboardPage } from './pages/dashboard/DashboardPage'

// Feature pages
import { DeveloperDNAPage } from './pages/features/developer-dna/DeveloperDNAPage'
import { PortfolioScorePage } from './pages/features/portfolio-score/PortfolioScorePage'
import { AIRecruiterPage } from './pages/features/ai-recruiter/AIRecruiterPage'
import { RepositoryRankingPage } from './pages/features/repository-ranking/RepositoryRankingPage'
import { ReadmeAnalyzerPage } from './pages/features/readme-analyzer/ReadmeAnalyzerPage'
import { GitHubWrappedPage } from './pages/features/github-wrapped/GitHubWrappedPage'
import { AIMentorPage } from './pages/features/ai-mentor/AIMentorPage'
import { CareerReadinessPage } from './pages/features/career-readiness/CareerReadinessPage'
import { LinkedInGeneratorPage } from './pages/features/linkedin-generator/LinkedInGeneratorPage'
import { PortfolioTimelinePage } from './pages/features/portfolio-timeline/PortfolioTimelinePage'
import { ResumeBuilderPage } from './pages/features/resume-builder/ResumeBuilderPage'
import { PortfolioGeneratorPage } from './pages/features/portfolio-generator/PortfolioGeneratorPage'
import { RepositoryComparePage } from './pages/features/repository-compare/RepositoryComparePage'
import { SettingsPage } from './pages/settings/SettingsPage'

/** Wraps a page component inside the protected AuthLayout shell */
function AppPage({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AuthLayout>{children}</AuthLayout>
    </ProtectedRoute>
  )
}

function App() {
  const { fetchMe, token } = useAuthStore()

  // Rehydrate user on mount if a token exists
  useEffect(() => {
    if (token) fetchMe()
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ── Onboarding (protected, no sidebar) ── */}
        <Route path="/welcome" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />
        <Route path="/connect-github" element={<ProtectedRoute><ConnectGitHubPage /></ProtectedRoute>} />
        {/* GitHub OAuth callback lands here with ?token= */}
        <Route path="/repository-sync" element={<ProtectedRoute><RepositorySyncPage /></ProtectedRoute>} />

        {/* ── Protected app pages (sidebar layout) ── */}
        <Route path="/dashboard"           element={<AppPage><DashboardPage /></AppPage>} />
        <Route path="/developer-dna"       element={<AppPage><DeveloperDNAPage /></AppPage>} />
        <Route path="/portfolio-score"     element={<AppPage><PortfolioScorePage /></AppPage>} />
        <Route path="/ai-recruiter"        element={<AppPage><AIRecruiterPage /></AppPage>} />
        <Route path="/repository-ranking"  element={<AppPage><RepositoryRankingPage /></AppPage>} />
        <Route path="/readme-analyzer"     element={<AppPage><ReadmeAnalyzerPage /></AppPage>} />
        <Route path="/github-wrapped"      element={<AppPage><GitHubWrappedPage /></AppPage>} />
        <Route path="/ai-mentor"           element={<AppPage><AIMentorPage /></AppPage>} />
        <Route path="/career-readiness"    element={<AppPage><CareerReadinessPage /></AppPage>} />
        <Route path="/linkedin-generator"  element={<AppPage><LinkedInGeneratorPage /></AppPage>} />
        <Route path="/portfolio-timeline"  element={<AppPage><PortfolioTimelinePage /></AppPage>} />
        <Route path="/resume-builder"      element={<AppPage><ResumeBuilderPage /></AppPage>} />
        <Route path="/portfolio-generator" element={<AppPage><PortfolioGeneratorPage /></AppPage>} />
        <Route path="/repository-compare"  element={<AppPage><RepositoryComparePage /></AppPage>} />
        <Route path="/settings"            element={<AppPage><SettingsPage /></AppPage>} />

        {/* ── 404 fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
