import axios from 'axios';

const API_TOKEN = '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';
const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
const headers = { Authorization: `Bearer ${API_TOKEN}` };

const generateResponse = async (query, hc_response) => {
  const jsonText = { inputs: query };
  try {
    const response = await axios.post(API_URL, jsonText, { headers });
    let generatedText = response.data[0].generated_text.replace(query, '').trim();

    // Split the generated text into sentences
    const sentences = generatedText.split(/[.!?]/);
    
    // Remove the last sentence if it doesn't end with punctuation
    if (sentences.length > 0) {
      const lastSentence = sentences[sentences.length - 1].trim();
      if (!/[.!?]$/.test(lastSentence)) {
        generatedText = sentences.slice(0, -1).join('.').trim();
      }
    }
    generatedText = generatedText.replace(/\s+\d+$/, '');

    return generatedText;
  } catch (error) {
    console.error('Error:', error.response.data);
    return hc_response;
  }
};

export default generateResponse;
