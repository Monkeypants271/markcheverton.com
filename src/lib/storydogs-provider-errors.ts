// Return fixed, credential-free diagnostics. Never echo provider messages/body.
export function punctuationProviderError(status: number, code?: string) {
  const safe = ' Your raw words are safe and editable.';
  if (status === 401) return { category: 'provider-authentication', message: 'OpenAI rejected the API key. Check the private server key.' + safe };
  if (code === 'insufficient_quota' || code === 'billing_hard_limit_reached') return { category: 'billing-quota', message: 'OpenAI billing or quota is unavailable. Check your API project’s billing and limits.' + safe };
  if (status === 404 || code === 'model_not_found' || status === 403) return { category: 'model-access', message: 'OpenAI could not access the configured model. Check model availability and project permissions.' + safe };
  if (status === 429) return { category: 'provider-rate-limit', message: 'OpenAI is rate-limiting requests. Wait before retrying.' + safe };
  if (status === 400 || status === 422) return { category: 'integration', message: 'OpenAI rejected the punctuation request format. The integration needs review.' + safe };
  return { category: 'provider-service', message: 'The OpenAI service could not finish punctuation. Please retry.' + safe };
}
