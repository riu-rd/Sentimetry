import axios from 'axios';

const combineScores = (array1, array2) => {
    const combined = [...array1, ...array2].reduce((acc, { label, score }) => {
        if (!acc[label]) {
            acc[label] = { score: 0, count: 0 };
        }
        acc[label].score += score;
        acc[label].count += 1;
        return acc;
    }, {});

    // Compute the average by dividing the total score by the count
    return Object.entries(combined).map(([label, { score, count }]) => ({
        label,
        score: score / count
    }));
};

const predictEmotions = async (paragraph) => {
    try {
        const endpoints = [
            { url: 'https://riu-rd-sentimetry-api.hf.space/logistic-regression', model: 'lr_result' },
            { url: 'https://riu-rd-sentimetry-api.hf.space/keras', model: 'keras_result' },
            { url: 'https://riu-rd-emoroberta-api.hf.space/emoroberta', model: 'emoroberta_result' }
        ];

        // Send all requests concurrently and handle failures gracefully
        const responses = await Promise.all(
            endpoints.map(endpoint =>
                axios.post(endpoint.url, { input: paragraph })
                    .then(response => response.data?.predictions || [])
                    .catch(error => {
                        console.error(`Error predicting emotions using ${endpoint.model}:`, error);
                        return [];
                    })
            )
        );

        // Combine predictions from all three models, averaging scores
        const combinedLogisticAndKeras = combineScores(responses[0], responses[1]);
        const finalCombine = combineScores(combinedLogisticAndKeras, responses[2]);
        const combinedResult = finalCombine.sort((a, b) => b.score - a.score);

        return { predictions: combinedResult };
    } catch (error) {
        console.error('Error predicting emotions:', error);
        return;
    }
};

export default predictEmotions;
