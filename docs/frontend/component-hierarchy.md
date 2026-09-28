# Frontend Component Hierarchy & Navigation Tree

```
<App>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/onboarding/sync" element={<RepositorySyncPage />} />
        <Route path="/features/developer-dna" element={<DeveloperDNAPage />} />
        <Route path="/features/ai-recruiter" element={<AIRecruiterPage />} />
        <Route path="/features/portfolio-generator" element={<PortfolioGeneratorPage />} />
        <Route path="/features/github-wrapped" element={<GitHubWrappedPage />} />
        <Route path="/features/career-readiness" element={<CareerReadinessPage />} />
        <Route path="/features/readme-analyzer" element={<ReadmeAnalyzerPage />} />
        <Route path="/features/resume-builder" element={<ResumeBuilderPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
</App>
```
