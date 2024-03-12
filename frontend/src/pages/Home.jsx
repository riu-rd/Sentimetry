import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import axios from "axios";
import predictEmotions from "../hooks/predictEmotions";

import {
  admirationResponses,
  amusementResponses,
  angerResponses,
  annoyanceResponses,
  approvalResponses,
  caringResponses,
  confusionResponses,
  curiousityResponses,
  desireResponses,
  disappointmentResponses,
  disapprovalResponses,
  disgustResponses,
  embarassmentResponses,
  excitementResponses,
  fearResponses,
  gratitudeResponses,
  griefResponses,
  joyResponses,
  loveResponses,
  nervousnessResponses,
  optimismResponses,
  prideResponses,
  realizationResponses,
  reliefResponses,
  remorseResponses,
  sadnessResponses,
  surpriseResponses,
  neutralResponses,
} from "./emotionResponses";

const Home = () => {
  // Declarations
  const [paragraph, setParagraph] = useState("");
  const [paragraphResult, setParagraphResult] = useState("");
  const [loadingParagraph, setLoadingParagraph] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [prompt, setPrompt] = useState("");
  const auth = getAuth();

  // On change
  const handleParagraphChange = (e) => {
    setParagraph(e.target.value);
  };

  // Log out
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert("Logged out Successfully");
      })
      .catch((err) => {
        alert("Log out error");
        console.error(err);
      });
  };

  // Clear Text
  const handleClear = () => {
    setParagraphResult("");
  };

  function getRandomResponse(responses) {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }

  // Submit Paragraph
  const onSubmitParagraph = (e) => {
    e.preventDefault();

    setLoadingParagraph(true);
    axios
      .post(`https://sentimetry-api.onrender.com/predict-journal`, {
        text: paragraph,
      })
      .then((response) => {
        setParagraphResult("");
        let text = "";
        const jsonData = response.data.predictions; // Access the 'predictions' property

        // Initialize variables for the emotion with the highest score
        let maxScore = -1;
        let emotion = "";

        // Iterate through the emotions in the data
        jsonData.forEach((entry) => {
          if (entry.score > maxScore) {
            maxScore = entry.score;
            emotion = entry.label;
          }
        });
        console.log("checkpoint");
        // generate the response based on emotion identified
        switch (emotion) {
          case "admiration":
            setAiResponse(getRandomResponse(admirationResponses));
            break;
          case "amusement":
            setAiResponse(getRandomResponse(amusementResponses));
            break;
          case "anger":
            setAiResponse(getRandomResponse(angerResponses));
            break;
          case "annoyance":
            setAiResponse(getRandomResponse(annoyanceResponses));
            break;
          case "approval":
            setAiResponse(getRandomResponse(approvalResponses));
            break;
          case "caring":
            setAiResponse(getRandomResponse(caringResponses));
            break;
          case "confusion":
            setAiResponse(getRandomResponse(confusionResponses));
            break;
          case "curiousity":
            setAiResponse(getRandomResponse(curiousityResponses));
            break;
          case "desire":
            setAiResponse(getRandomResponse(desireResponses));
            break;
          case "disappointment":
            setAiResponse(getRandomResponse(disappointmentResponses));
            break;

          case "disapproval":
            setAiResponse(getRandomResponse(disapprovalResponses));
            break;
          case "disgust":
            setAiResponse(getRandomResponse(disgustResponses));
            break;
          case "embarasement":
            setAiResponse(getRandomResponse(embarassmentResponses));
            break;
          case "excitement":
            setAiResponse(getRandomResponse(excitementResponses));
            break;
          case "fear":
            setAiResponse(getRandomResponse(fearResponses));
            break;
          case "gratitude":
            setAiResponse(getRandomResponse(gratitudeResponses));
            break;
          case "grief":
            setAiResponse(getRandomResponse(griefResponses));
            break;
          case "joy":
            setAiResponse(getRandomResponse(joyResponses));
            break;
          case "love":
            setAiResponse(getRandomResponse(loveResponses));
            break;
          case "nervousness":
            setAiResponse(getRandomResponse(nervousnessResponses));
            break;

          case "optimism":
            setAiResponse(getRandomResponse(optimismResponses));
            break;
          case "pride":
            setAiResponse(getRandomResponse(prideResponses));
            break;
          case "realization":
            setAiResponse(getRandomResponse(realizationResponses));
            break;
          case "relief":
            setAiResponse(getRandomResponse(reliefResponses));
            break;
          case "remorse":
            setAiResponse(getRandomResponse(remorseResponses));
            break;
          case "sadness":
            setAiResponse(getRandomResponse(sadnessResponses));
            break;
          case "surprise":
            setAiResponse(getRandomResponse(surpriseResponses));
            break;
          case "neutral":
            setAiResponse(getRandomResponse(neutralResponses));
            break;
          default:
            setAiResponse("no emotion matched");
        }
        setPrompt(`The user wrote ${paragraph}, the user portrays the emotion: ${emotion}.
                 The task is to respond, give advice, and empathize with this entry by getting a
                 random response. The response is ${aiResponse}. Tailor this response in a way that it 
                 will sound personalized, no bias, with good intention, and is related to the emotion
                 ${emotion}.
      `);
        setParagraphResult(emotion);
        setParagraph("");
        setLoadingParagraph(false);

        axios
          .post("http://127.0.0.1:5000/api", { message: prompt })
          .then((res) => {
            setAiResponse(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.error(err);
        setLoadingParagraph(false);
      });
  };

  return (
    <div className="bg-background-green">
      <div className="w-screen m-0 p-4 ps-8 text-md bg-main-green">
        <h1 className="century-gothic">SentiMetry</h1>
      </div>
      <div className="p-10 px-28">
        <div className="mb-5">
          <h1 className="font-bold text-main-color">LOGS</h1>
        </div>
        <div className="flex gap-10">
          <div className="space-y-10 w-1/2">
            <div
              style={{ backgroundColor: "#8DA290" }}
              className="rounded-2xl w-full p-4 h-max"
            >
              <h3>
                {/*place text here from database*/}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum
              </h3>
              <h4 className="text-end">
                1/1/2024
                {/*place date here from database*/}
              </h4>
            </div>

            <div
              style={{ backgroundColor: "#8DA290" }}
              className="rounded-2xl w-full p-4 h-max"
            >
              <h3>
                {/*place text here from database*/}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum
              </h3>
              <h4 className="text-end">
                1/1/2024
                {/*place date here from database*/}
              </h4>
            </div>

            <div
              style={{ backgroundColor: "#8DA290" }}
              className="rounded-2xl w-full p-4 h-max"
            >
              <h3>
                {/*place text here from database*/}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum
              </h3>
              <h4 className="text-end">
                1/1/2024
                {/*place date here from database*/}
              </h4>
            </div>
          </div>

          <div className="w-full">
            <h2
              style={{ color: "#BE912B" }}
              className="text-4xl font-bold mb-3"
            >
              How Are You Feeling?
            </h2>
            <fieldset className="space-y-6">
              <form onSubmit={onSubmitParagraph}>
                <textarea
                  rows={10}
                  cols={50}
                  placeholder="Enter a Paragraph"
                  onChange={handleParagraphChange}
                  value={paragraph}
                  className="rounded-2xl p-4 w-full bg-white mb-3 text-black text-xl"
                />
                <button
                  style={{ backgroundColor: "#BE912B" }}
                  type="submit"
                  className="font-bold text-2xl p-4 m-0 rounded-2xl"
                >
                  Submit
                </button>
              </form>
              <div>
                <h3
                  style={{ color: "#BE912B" }}
                  className="text-4xl font-bold mb-3"
                >
                  Result
                </h3>
                <textarea
                  value={
                    loadingParagraph
                      ? "Loading. . ."
                      : "Your emotion is: " +
                        paragraphResult +
                        "\n" +
                        aiResponse
                  }
                  readOnly={true}
                  rows={10}
                  cols={80}
                  placeholder="Result"
                  className="rounded-2xl bg-white p-4 w-full text-black text-xl"
                ></textarea>
              </div>
            </fieldset>
          </div>
        </div>
        <div className="flex justify-end p-3 space-x-4">
          <button onClick={handleLogout} className="clear m-0">
            Log Out
          </button>
          <button onClick={handleClear} className="clear m-0">
            Clear All Results
          </button>
        </div>
        {/*<fieldset>
                <form onSubmit={onSubmitText}>
                <h3>Emotion from a Sentence</h3>
                <input type='text' placeholder='Enter a Sentence' onChange={handleSentenceChange} value={sentence}/>
                <button type='submit'>Submit Text</button>
                </form>
                <h3>Result</h3>
                <p>{loadingSentence ? "Loading. . ." : sentenceResult}</p>
            </fieldset> */}
      </div>
    </div>
  );
};

export default Home;
