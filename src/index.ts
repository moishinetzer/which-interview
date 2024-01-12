import { run } from './run';

process.stdin.setEncoding('utf8');

let inputData = '';

process.stdin.on('data', (chunk) => {
  inputData += chunk;
});

process.stdin.on('end', () => {
  // Perhaps do input validation here in future (using Zod or Yup)
  const inputJson = JSON.parse(inputData);

  try {
    const result = run(inputJson);
    console.log(JSON.stringify(result));
  } catch (err) {
    // In the future handle errors more gracefully
    // But this is out of the scope of this challenge where input is guaranteed to be valid shape
    console.log(err);
  }
});
