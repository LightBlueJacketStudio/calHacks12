// this module extracts the key information for the second agent to respond
// will be using Open AI as the extractor model for now

async function extractInfo(forwardToken, messages) {
  const proxyUrl = 'https://api.lavapayments.com/v1/forward?u=' +
    encodeURIComponent('https://api.openai.com/v1/chat/completions');

  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${forwardToken}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI request failed: ${error}`);
  }

  const data = await response.json();

  // Extract request ID for debugging
  const requestId = response.headers.get('x-lava-request-id');

  return {
    data,
    requestId,
    usage: data.usage // OpenAI's native usage field
  };
}

// Example usage
const result = await callOpenAI(process.env.LAVA_FORWARD_TOKEN, [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Explain quantum computing in simple terms.' }
]);

console.log('Response:', result.data.choices[0].message.content);
console.log('Usage:', result.usage);
console.log('Request ID:', result.requestId);
// Output:
// Usage: { prompt_tokens: 23, completion_tokens: 133, total_tokens: 156 }

// Export the functions
module.exports = { extractInfo };