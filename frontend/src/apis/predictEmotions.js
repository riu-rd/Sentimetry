import axios from 'axios';

const API_TOKEN = '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';
const API_URL = "https://api-inference.huggingface.co/models/arpanghoshal/EmoRoBERTa";
const headers = {"Authorization": `Bearer ${API_TOKEN}`};

const combineScores = (array1, array2) => {
    const combined = [...array1, ...array2].reduce((acc, { label, score }) => {
        acc[label] = (acc[label] || 0) + score;
        return acc;
    }, {});
    return Object.entries(combined).map(([label, score]) => ({ label, score }));
}

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
            console.error('Error predicting emotions using EmoRoBERTa:', error);
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
    
    try {
        const lr_result = await axios.post('https://sentimetry-api.onrender.com/logistic-regression', {
            input: paragraph
        });
        const combinedPredictions = combineScores(lr_result.data.predictions, result);

        // Sort the result in descending order
        const combinedResult = combinedPredictions.sort((a, b) => b.score - a.score);

        return { predictions: combinedResult };
    } catch (error) {
        console.error('Error predicting emotions using other models:', error);
        return;
    }
};

export default predictEmotions;
