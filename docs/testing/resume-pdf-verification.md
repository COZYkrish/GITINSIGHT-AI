# Resume Builder Export & PDF Verification Plan

1. Trigger Resume Generation from `/features/resume-builder`.
2. Inspect rendered HTML preview card for bullet formatting.
3. Click "Download PDF" (`jspdf` + `html2canvas`).
4. Verify exported PDF preserves text selectable layout and clean margins.
