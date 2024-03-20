import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../firebase.js";
import predictEmotions from "../apis/predictEmotions";
import generateResponse from "../apis/generateResponse.js";
import { collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";
import "../index.css";

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
import React from "react";
import EmoLoader from "../components/EmoLoader.jsx";

const Home = () => {
  // Declarations
  const [paragraph, setParagraph] = useState("");
  const [loadingParagraph, setLoadingParagraph] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [finalAIResponse, setFinalAIResponse] = useState("");
  const [show, setShow] = useState("log");
  const [emotions, setEmotions] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [logs, setLogs] = useState([]);
  const [openedLogEntry, setOpenedLogEntry] = useState("");
  const [openedLogEmotions, setOpenedLogEmotions] = useState("");
  const [openedLogResponse, setOpenedLogResponse] = useState("");
  const [openedLogDate, setOpenedLogDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Retrieve data from database
  const auth = getAuth();
  const logsCollectionRef = collection(
    db,
    `users/${auth.currentUser?.uid}/logs`
  );
  const userDocsRef = doc(db, "users", `${auth.currentUser?.uid}`);

  // Run these upon page load
  useEffect(() => {
    retrieveLogs();
    getDoc(userDocsRef)
      .then((snapshot) => {
        const userInfo = snapshot.data();
        setFirstName(userInfo?.firstName);
        setLastName(userInfo?.lastName);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // When there is AI response, Get response and store the entries
  useEffect(() => {
    if (aiResponse) {
      const emotionString = emotions.join(", ");
      setFinalAIResponse("");

      const prompt = `My name is ${firstName.trim()} ${lastName.trim()}. ${paragraph.trim()}.
          I feel ${emotionString.trim()} about it. Give me some advice using this another advice: 
          ${aiResponse.trim()}. You should be personal, sensitive, no bias, friendly, and very empathetic. Focus on things about me. Give advice about me.`;

      generateResponse(prompt, aiResponse.trim())
        .then((res) => {
          setFinalAIResponse(res);

          addDoc(logsCollectionRef, {
            log: paragraph.trim(),
            emotions: emotionString,
            response: finalAIResponse,
            date: new Date().toISOString().split("T")[0],
          })
            .then(() => {
              retrieveLogs();
              setLoadingParagraph(false);
            })
            .catch((err) => {
              console.error(err);
              alert("Logging Unsuccessful!");
              setLoadingParagraph(false);
            });
        })
        .catch((err) => {
          console.error(err);
          setLoadingParagraph(false);
        });
    }
  }, [aiResponse]);

  // On paragraph change
  const handleParagraphChange = (e) => {
    setParagraph(e.target.value);
  };

  // Log out
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
      })
      .catch((err) => {
        alert("Log out error");
        console.error(err);
      });
  };

  // Clear Text
  const handleClear = () => {
    setShowResult(false);
  };

  // Get a random AI response
  function getRandomResponse(responses) {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }

  // Retrieve the logs of the current user
  const retrieveLogs = () => {
    getDocs(logsCollectionRef)
      .then((snapshot) => {
        const current = [];
        snapshot.forEach((doc) => {
          current.push(doc.data());
        });
        // @ts-ignore
        setLogs(current);
        console.log("Logs retrieved successfully");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Display the data of the clicked entry
  const handleOpenLogs = (entry, emotions, response, date) => {
    setShow("history");
    setOpenedLogEntry(entry);
    setOpenedLogEmotions(emotions);
    setOpenedLogResponse(response);
    setOpenedLogDate(date);
    console.log("im here");
  };

  // When submit button is clicked
  const onSubmitParagraph = (e) => {
    e.preventDefault();
    setShowResult(true);
    setLoadingParagraph(true);
    predictEmotions(paragraph).then((response) => {
      // @ts-ignore
      const jsonData = response.predictions;
      // Sort the emotions
      const sortedEmotions = jsonData.sort((a, b) => b.score - a.score);

      // Get the top 3 emotions
      const top3Emotions = sortedEmotions.slice(0, 3);

      // Get only the emotions from the array of objects
      const emotions = [];
      // @ts-ignore
      top3Emotions.forEach((entry, index) => {
        emotions.push(entry.label);
      });
      // @ts-ignore
      setEmotions(emotions);

      // Generate the response based on the emotion identified
      switch (top3Emotions[0].label) {
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

    });
  };

  return (
    <div className="bg-background-green">
        <div className="m-0 p-3 text-md bg-main-green justify-between flex items-center lg:w-screen w-full">
            <h1 className="century-gothic text-white font-black text-4xl sm:text-5xl ps-8 sm:ps-14">SentiMetry</h1>
            <button onClick={handleLogout} className="bg-transparent m-0 text-white p-4 rounded-xl lg:pe-12 text-xl hover:text-yellow-200"> Log Out</button>
        </div>
        <div className="pt-6 px-14 lg:px-28 xl:h-screen">
            <div className="mb-5 text-start">
                <h1 className="text-sub-yellow font-bold text-4xl sm:text-5xl">LOGS</h1>
            </div>
            <div className="xl:flex gap-10 h-5/6">
                <div className="space-y-5 w-full xl:w-1/2 overflow-y-scroll h-96 xl:h-full">
                    {logs.length > 0 ? (
                        logs.map((item, index) => (
                            <button key={index} className="rounded-2xl w-full xl:w-11/12 p-4 h-max text-start bg-main-green hover:bg-emerald-600 space-y-4" onClick={() => handleOpenLogs(item.
// @ts-ignore
                            log, item.emotions, item.response, item.date)}>
                                <div>
                                    <h1 className="text-2xl font-bold text-yellow-200">Entry:</h1>
                                    <h3 className="text-xl">{item.
// @ts-ignore
                                    log}</h3>
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold text-yellow-200">Emotions:</h1>
                                    <h3 className="text-xl">{item.
// @ts-ignore
                                    emotions}</h3>
                                </div>

                                <h4 className="text-end">{item.
// @ts-ignore
                                date}</h4>
                            </button>
                        ))
                    ) : (
                        <div className="text-start text-2xl text-gray-500">No logs yet</div>
                    )}
                </div>


                {show == "log" ? (
                    <div className="mt-4 xl:mt-0 gap-4 w-full">
                        <div className="w-full">
                            <h2 className="text-sub-yellow text-4xl font-bold mb-3">How Are You Feeling?</h2>
                            <fieldset className="space-y-6">
                                <form>
                                    <textarea rows={10} cols={50} placeholder="Enter a Paragraph" onChange={(e) => handleParagraphChange(e)} value={paragraph}
                                              className="w-full h-full resize-none rounded-2xl p-4 bg-white mb-3 text-black text-xl sm:text-xl md:text-xl lg:text-xl xl:text-xl"
                                    />
                                </form>
                            </fieldset>
                        </div>

                        <div className="grid grid-rows-7 w-full">
                            <div className="row-span-2">
                                <h3 className="text-sub-yellow text-4xl font-bold mb-3">Emotions</h3>
                                {showResult ? (
                                    <div className="rounded-2xl bg-white p-4 w-full text-black text-xl h-3/4">
                                        {loadingParagraph ? <EmoLoader /> : "Based on your journal entry, your feelings are " + emotions[0] +
                                                ", " + emotions[1] + ", and " + emotions[2]}
                                    
                                    </div>
                                ) : (
                                    <div className="rounded-2xl bg-white p-4 w-full text-gray-400 text-xl h-3/4">
                                        Your emotions will display here
                                    </div>
                                )}
                            </div>

                            <div className="row-span-5 mt-10 sm:mt-10">
                                <h3 className="text-sub-yellow text-4xl font-bold mb-3">
                                    Response
                                </h3>
                                {showResult ? (
                                    <div className="rounded-2xl bg-white p-4 w-full text-black text-xl h-custom">
                                        {loadingParagraph ? <EmoLoader /> : finalAIResponse}
                                    </div>
                                    ) : (
                                    <div className="rounded-2xl bg-white p-4 w-full text-gray-400 text-xl h-custom">
                                        {"Response to you will display here"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <> </>
                )}

                {show == "history" ? (
                    <div className="w-full rounded-2xl gap-5 xl:grid xl:grid-cols-3 space-y-3 xl:space-y-0 mt-3 sm:mt-3">
                        <div className="bg-main-green p-6 col-span-2 rounded-xl xl:h-full">
                            <div className="space-y-3">
                                <h1 className="text-yellow-200 font-bold text-5xl">Journal Entry:</h1>
                                <h3 className="text-2xl ps-5">{openedLogEntry}</h3>
                            </div>

                            <h3 className="text-end pt-4">{openedLogDate}</h3>
                        </div>

                        <div className="space-y-5 grid grid-rows-4">
                            <div className="space-y-3 bg-main-green p-6 rounded-xl row-span-1">
                                <h1 className="text-yellow-200 font-bold">Emotions:</h1>
                                <h3 className="text-2xl ps-5">{openedLogEmotions}</h3>
                            </div>

                            <div className="space-y-3 bg-main-green p-6 rounded-xl row-span-3">
                                <h1 className="text-yellow-200 font-bold">Response:</h1>
                                <h3 className="text-2xl ps-5">{openedLogResponse}</h3>
                            </div>
                        </div>
                    </div>
                ) : (
                    <> </>
                )}
                </div>

                {show == "log" ? (
                <div className="flex justify-end mt-14 sm:mt-14 xl:mt-0 p-3 space-x-4">
                     <button
                        onClick={handleClear}
                        className="clear m-0 bg-slate-500 hover:bg-slate-400 p-4 text-xl lg:text-md xl:text-lg font-bold rounded-xl"
                    >
                        Clear All Results
                    </button>
                    <button
                        type="submit"
                        className="font-bold bg-sub-yellow text-white text-xl p-4 m-0 rounded-2xl hover:bg-yellow-500"
                        onClick={(e) => onSubmitParagraph(e)}
                    >
                        Submit
                    </button>
                </div>
                ) : (
                <> </>
                )}

                {show == "history" ? (
                <div className="flex justify-end space-x-4 mt-3">
                    <button
                        onClick={() => setShow("log")}
                        className="clear m-0 bg-sub-yellow p-4 rounded-xl font-bold xl:w-1/12 text-xl hover:bg-yellow-500 mt-3"
                    >
                        Done
                    </button>
                </div>
            ) : (
            <> </>
            )}
        </div>
    </div>
  );
};

export default Home;
