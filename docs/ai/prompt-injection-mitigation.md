# Prompt Injection Mitigation & Delimiter Isolation

## Defense Architecture
All dynamic external input is enclosed within strict XML-style delimiters:
```
<developer_context>
  <repository_name>gitinsight-ai</repository_name>
  <commit_sample>{{SANITIZED_COMMITS}}</commit_sample>
</developer_context>
```
