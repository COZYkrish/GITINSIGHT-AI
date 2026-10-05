# Secondary Rate Limit Exponential Backoff with Jitter

## Full Jitter Algorithm
$$T_{\text{wait}} = \text{random}(0, \min(T_{\max}, T_{\text{base}} \times 2^{\text{attempt}}))$$
