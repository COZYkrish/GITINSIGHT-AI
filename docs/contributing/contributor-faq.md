# Contributor FAQ & Quick Reference

### How do I run only backend unit tests?
```bash
cd backend && npm test
```

### How do I mock GitHub API responses locally?
Set `MOCK_GITHUB_API=true` in `backend/.env` to utilize fixture payloads from `test/fixtures/`.
