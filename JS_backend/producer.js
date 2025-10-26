// this module produces the solution given the emergency information
// will be using gemini as the producer model for now



async function produceSolution(forwardToken, prompt) {
  // 1. Define the Google OpenAI-compatible endpoint
  const PROVIDER_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';

  // 2. Build the Lava forward proxy URL
  const url = `${process.env.LAVA_BASE_URL}/forward?u=${PROVIDER_ENDPOINT}`;

  // 3. Set up authentication headers
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${forwardToken}`
  };

  // 4. Define the request body (standard OpenAI format)
  const requestBody = {
    model: 'gemini-2.5-flash',  // Use any Gemini model
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 1024
  };


  // 5. Make the request

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    // 6. Parse the response
    const data = await response.json();

    // 7. Extract usage data (standard OpenAI format)
    const usage = data.usage;
    console.log('\nUsage Tracking:');
    console.log(`  Prompt tokens: ${usage.prompt_tokens}`);
    console.log(`  Completion tokens: ${usage.completion_tokens}`);
    console.log(`  Total tokens: ${usage.total_tokens}`);

    // 8. Extract request ID (from response header)
    const requestId = response.headers.get('x-lava-request-id');
    console.log(`\nLava Request ID: ${requestId}`);
    console.log('  (Use this ID to find the request in your dashboard)');

    // 9. Display the AI response
    console.log('\nAI Response:');
    console.log(data.choices[0].message.content);


}


    produceSolution(
      process.env.LAVA_FORWARD_TOKEN,
      `given the information accident occured, produce a series of steps that the rescuere or bystander can do, such as calling the emergency services`
    );

    

    //console.log('Producer Result:-----------------------------------------');
    //console.log(producerResult.data.content[0].text);



// Export the functions
module.exports = { produceSolution };