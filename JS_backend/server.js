// Import dependencies
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { extractInfo } = require("./extractor"); // ← import from extractor.js
const { produceSolution } = require("./producer"); // ← import from producer.js
const { comparator } = require("./comparator"); // ← import from producer.js

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", async (req, res) => {
  try {


    // Extractor
    const extractedResult = await extractInfo(process.env.LAVA_FORWARD_TOKEN, [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'extract key infomation that the rescuer or police might needed of a car accident be very specific and precise in bullet point' }
    ]);

    console.log('Extractor Result:-----------------------------------------');
    console.log('Response:', extractedResult.data.choices[0].message.content);
    console.log('Usage:', extractedResult.usage);
    console.log('Request ID:', extractedResult.requestId);

    // producer
    const producerResult = await produceSolution(
      process.env.LAVA_FORWARD_TOKEN,
      `given the information "${extractedResult.data.choices[0].message.content}" produce a series of steps that the rescuere or bystander can do, such as calling the emergency services`
    );

    console.log(result.candidates[0].content.parts[0].text);

    console.log('Producer Result:-----------------------------------------');
    console.log(producerResult.data.content[0].text);


    //comparator
    const result = await comparator(process.env.LAVA_FORWARD_TOKEN, [
      { role: 'user', content: `given the information ${producerResult.data.content[0].text}, give a possibility/ difficulty of doing such procedure as a bystander of an accident and give your resoning` }
    ]);
    console.log('Comparator Result:-----------------------------------------');
    console.log(result.data.content[0].text);

    const frontendResult = {
      extractor: extractedResult,
      producer: producerResult,
      comparator: result
    }
    res.json(frontendResult);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating response");
  }
});


// Example GET route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Node backend!" });
});

// Example POST route
app.post("/api/data", (req, res) => {
  const data = req.body;
  res.json({ message: "Data received successfully!", received: data });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});

