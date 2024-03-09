import axios from 'axios';

const API_TOKEN = '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';
const API_URL = "https://api-inference.huggingface.co/models/arpanghoshal/EmoRoBERTa";
const headers = {"Authorization": `Bearer ${API_TOKEN}`};

const predictEmotions = async (paragraph) => {
    // Split the huge chunk of text into a string list
    const textList = paragraph.split(/[.!?;\n]/).map(text => text.trim()).filter(text => text);

    // Create a list of all predictions per text
    const predictionsPerText = [];
    for (const text of textList) {
        const payload = { "inputs": text };
        try {
            const response = await axios.post(API_URL, payload, { headers });
            const emotion = response.data;
            predictionsPerText.push(emotion[0]);
        } catch (error) {
            console.error('Error predicting emotions:', error);
        }
    }

    // Create a Map to aggregate scores for each label
    const total = new Map();

    // Iterate over each list and aggregate the scores
    for (const prediction of predictionsPerText) {
        for (const emotionDict of prediction) {
            const label = emotionDict.label;
            const score = emotionDict.score;
            total.set(label, (total.get(label) || 0) + score);
        }
    }

    // Convert the Map to an array of objects
    const result = Array.from(total, ([label, score]) => ({ label, score }));

    // Sort the result in descending order
    const sortedResult = result.sort((a, b) => b.score - a.score);

    return { predictions: sortedResult };
};

export default predictEmotions;
