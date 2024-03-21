import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../firebase.js";
import predictEmotions from "../apis/predictEmotions";
import generateResponse from "../apis/generateResponse.js";
import { collection, addDoc, getDocs, getDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
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

      const sys_prompt = `You are a compassionate mental health companion, dedicated to supporting individuals through their emotional journeys. Approach each interaction with empathy and understanding, offering gentle guidance and practical advice tailored to the user's thoughts and emotions. Your goal is to provide a safe space for users to express themselves openly, while offering strategies and insights to help them navigate their mental health challenges with confidence and resilience. Prior, you told the user "${aiResponse.trim()}"`
      const prompt = `Hi I'm ${firstName.trim()} ${lastName.trim()}. My thoughts are: "${paragraph.trim()}". I feel "${emotionString.trim()}" about it. What can you say about this?`

      const prefix = "<|im_start|>"
      const suffix = "<|im_end|>\n"
      const sys_format = prefix + "system\n" + sys_prompt + suffix
      const user_format = prefix + "user\n" + prompt + suffix
      const assistant_format = prefix + "assistant\n"
      const input_text = sys_format + user_format + assistant_format

      generateResponse(input_text, aiResponse.trim())
        .then((res) => {
          setFinalAIResponse(res);
        })
        .catch((err) => {
          console.error(err);
          setLoadingParagraph(false);
        });
    }
  }, [aiResponse]);

  // When there is Final AI Response, log the response
  useEffect(() => {
    const emotionString = emotions.join(", ");

    if (finalAIResponse !== "") {
      addDoc(logsCollectionRef, {
        log: paragraph.trim(),
        emotions: emotionString,
        response: finalAIResponse,
        date: new Date().toISOString().split("T")[0],
        timestamp: serverTimestamp()
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
    }
  }, [finalAIResponse]);

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
    setParagraph("")
    setFinalAIResponse("")
    setEmotions([])
  };

  // Get a random AI response
  function getRandomResponse(responses) {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }

  // Retrieve the logs of the current user
  const retrieveLogs = () => {
    getDocs(query(logsCollectionRef, orderBy('timestamp', 'asc')))
      .then((snapshot) => {
        const current = [];
        snapshot.forEach((doc) => {
          current.push(doc.data());
        });
        // @ts-ignore
        // current.reverse();
        // current.sort((a, b) => {
        //   let dateA = new Date(a.date);
        //   let dateB = new Date(b.date);
        //   // @ts-ignore
        //   return dateA - dateB;
        // });
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

    if (paragraph === "") {
      alert("What's on your mind? log it in the text area :)")
      return;
    }

    if (paragraph.length <= 5) {
      alert("Message is too short :(")
      return;
    }

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
        <div className="pt-6 px-14 lg:px-28 xl:h-mainContentHeight">
            <div className="mb-3 text-start">
                <h1 className="text-sub-yellow font-bold text-4xl sm:text-4xl">LOGS</h1>
            </div>
            <div className="xl:flex xl:flex-wrap gap-10 xl:h-[80vh] justify-center">
                <div className="space-y-5 w-full xl:w-1/3 overflow-y-scroll h-96 xl:h-full">
                    {logs.length > 0 ? (
                        logs.slice().reverse().map((item, index) => (
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
                    <div className=" flex flex-col justify-center before:mt-4 xl:mt-0 w-full xl:w-3/5 h-fit">
                        <div className="w-full">
                            <h2 className="text-sub-yellow text-4xl font-bold mb-3">How Are You Feeling?</h2>
                            <fieldset className="">
                                <form>
                                    <textarea placeholder="Enter a Paragraph" onChange={(e) => handleParagraphChange(e)} value={paragraph}
                                              className="w-full h-44 resize-none rounded-2xl p-4 bg-white mb-3 text-black text-xl sm:text-xl md:text-xl lg:text-xl xl:text-xl"
                                    />
                                </form>
                            </fieldset>
                        </div>

                        
                            <div className="">
                                <h3 className="text-sub-yellow text-4xl font-bold mb-3">Emotions</h3>
                                {showResult ? (
                                    <div className="rounded-2xl bg-white p-4 w-full text-black text-xl h-2/4">
                                        {loadingParagraph ? <EmoLoader /> : "Based on your journal entry, your feelings are " + emotions[0] +
                                                ", " + emotions[1] + ", and " + emotions[2]}
                                    
                                    </div>
                                ) : (
                                    <div className="rounded-2xl bg-white p-4 w-full h-3/4">
                                        <h1 className="text-gray-400 text-xl">Your emotions will display here</h1>
                                    </div>
                                )}
                            </div>

                            <div className="lg:h-1/2 xl:h-3/4 mt-3">
                                <h3 className="text-sub-yellow text-4xl font-bold mb-3">
                                    Response
                                </h3>
                                {showResult ? (
                                    <div className="rounded-2xl bg-white p-4 w-full text-black text-xl h-3/4">
                                        {loadingParagraph ? <EmoLoader /> : finalAIResponse}
                                    </div>
                                    ) : (
                                    <div className="rounded-2xl bg-white p-4 w-full text-gray-400 text-xl h-3/4">
                                        {"Response to you will display here"}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end xl:mt-0 p-3 space-x-4">
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
                        
                    </div>
                ) : (
                    <> </>
                )}

                {show == "history" ? (
                    <div className="flex flex-row flex-wrap justify-start items-center w-full xl:w-3/5 rounded-2xl gap-2 mt-8 xl:mt-0 xl:h-[75vh]">
                        <div className="bg-main-green p-6 rounded-xl h-fit w-full xl:w-1/2">
                            <div className="overflow-y-scroll  xl:h-[35rem]">
                                <h1 className="text-yellow-200 font-bold text-4xl">Journal Entry:</h1>
                                <h3 className="text-2xl ps-5">{openedLogEntry}</h3>
                            </div>

                            <h3 className="text-end pt-4">{openedLogDate}</h3>
                        </div>

                        <div className="flex flex-row flex-wrap justify-start items-start gap-2 w-full xl:w-2/5 rounded-xl h-fit">
                            <div className=" bg-main-green p-6 rounded-xl w-full h-fit">
                                <h1 className="text-yellow-200 font-bold text-4xl">Emotions:</h1>
                                <h3 className="text-2xl ps-5 xl:h-[4rem]">{openedLogEmotions}</h3>
                            </div>

                            <div className=" bg-main-green p-6 rounded-xl w-full h-fit overflow-y-scroll xl:h-[30.5rem]">
                                <h1 className="text-yellow-200 font-bold text-4xl">Response:</h1>
                                <h3 className="text-2xl ps-5">{openedLogResponse}</h3>
                            </div>
                            
                        </div>
                        <div className="w-full flex justify-center">
                            <button
                                onClick={() => setShow("log")}
                                className="clear m-0 bg-sub-yellow p-4 rounded-xl font-bold xl:w-1/2 text-xl hover:bg-yellow-500"
                            >
                                Done
                            </button>
                          </div>
                    </div>
                ) : (
                    <> </>
                )}
                </div>
        </div>
    </div>
  );
};

export default Home;
