import axios from 'axios';

const combineScores = (array1, array2) => {
    const combined = [...array1, ...array2].reduce((acc, { label, score }) => {
        acc[label] = (acc[label] || 0) + score;
        return acc;
    }, {});
    return Object.entries(combined).map(([label, score]) => ({ label, score }));
}

const predictEmotions = async (paragraph) => {
    try {
        let lr_result, keras_result, emoroberta_result;

        try {
            lr_result = await axios.post('https://riu-rd-sentimetry-api.hf.space/logistic-regression', {
                input: paragraph
            });
        } catch (error) {
            console.error('Error predicting emotions using logistic regression model:', error);
        }

        try {
            keras_result = await axios.post('https://riu-rd-sentimetry-api.hf.space/keras', {
                input: paragraph
            });
        } catch (error) {
            console.error('Error predicting emotions using Keras model:', error);
        }

        try {
            emoroberta_result = await axios.post("https://riu-rd-emoroberta-api.hf.space/emoroberta", {
                input: paragraph
            });
        } catch (error) {
            console.error('Error predicting emotions using EmoRoBERTa model:', error);
        }

        const combinedLogisticAndKeras = combineScores(lr_result?.data?.predictions || [], keras_result?.data?.predictions || []);
        const finalCombine = combineScores(combinedLogisticAndKeras, emoroberta_result?.data?.predictions || []);
        const combinedResult = finalCombine.sort((a, b) => b.score - a.score);

        return { predictions: combinedResult };
    } catch (error) {
        console.error('Error predicting emotions:', error);
        return;
    }
};

export default predictEmotions;