import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../../firebase.js";
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
          ${aiResponse.trim()}. You should be personal, sensitive, no bias, friendly, and very empathetic.`;

      generateResponse(prompt)
        .then((res) => {
          setFinalAIResponse(res);

          addDoc(logsCollectionRef, {
            log: paragraph.trim(),
            emotions: emotionString,
            response: finalAIResponse,
            date: new Date().toISOString().split("T")[0],
          })
            .then(() => {
              alert("Logged Successfully!");
              retrieveLogs();
            })
            .catch((err) => {
              console.error(err);
              alert("Logging Unsuccessful!");
            });
        })
        .catch((err) => {
          console.error(err);
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
        alert("Logged out Successfully");
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
      const jsonData = response.predictions;
      // Sort the emotions
      const sortedEmotions = jsonData.sort((a, b) => b.score - a.score);

      // Get the top 3 emotions
      const top3Emotions = sortedEmotions.slice(0, 3);

      // Get only the emotions from the array of objects
      const emotions = [];
      top3Emotions.forEach((entry, index) => {
        emotions.push(entry.label);
      });
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
      setLoadingParagraph(false);
    });
  };

  return (
    <div className="bg-background-green">
      <div className="w-screen m-0 p-4 ps-8 text-md bg-main-green justify-between flex">
        <h1 className="century-gothic text-white font-black">SentiMetry</h1>
        <button
          onClick={handleLogout}
          className="bg-transparent m-0 text-white p-4 rounded-xl text-xl me-5 hover:text-yellow-200"
        >
          Log Out
        </button>
      </div>
      <div className="pt-10 px-28 h-screen">
        <div className="mb-5">
          <h1 className="text-sub-yellow font-bold">LOGS</h1>
        </div>
        <div className="flex gap-10 h-3/4">
          <div className="space-y-5 w-1/2 overflow-y-scroll">
            {logs.map((item, index) => (
              <button
                key={index}
                className="rounded-2xl w-11/12 p-4 h-max text-start bg-main-green hover:bg-emerald-600 space-y-4"
                onClick={() =>
                  handleOpenLogs(
                    item.log,
                    item.emotions,
                    item.response,
                    item.date
                  )
                }
              >
                <div>
                  <h1 className="text-2xl font-bold text-yellow-200">Entry:</h1>
                  <h3 className="text-xl">{item.log}</h3>
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-yellow-200">
                    Emotions:
                  </h1>
                  <h3 className="text-xl">{item.emotions}</h3>
                </div>

                <h4 className="text-end">{item.date}</h4>
              </button>
            ))}
          </div>

          {show == "log" ? (
            <div className="flex gap-4">
              <div className="w-full ">
                <h2 className="text-sub-yellow text-4xl font-bold mb-3">
                  How Are You Feeling?
                </h2>
                <fieldset className="space-y-6">
                  <form onSubmit={(e) => onSubmitParagraph(e)}>
                    <textarea
                      rows={21}
                      cols={50}
                      placeholder="Enter a Paragraph"
                      onChange={(e) => handleParagraphChange(e)}
                      value={paragraph}
                      className="w-full h-full resize-none rounded-2xl p-4 bg-white mb-3 text-black text-xl"
                    />
                    <button
                      type="submit"
                      className="font-bold bg-sub-yellow text-white text-2xl p-4 m-0 rounded-2xl hover:bg-yellow-500"
                    >
                      Submit
                    </button>
                  </form>
                </fieldset>
              </div>

              <div>
                <div>
                  <h3 className="text-sub-yellow text-4xl font-bold mb-3">
                    Emotions
                  </h3>
                  {showResult ? (
                    <textarea
                      value={
                        loadingParagraph
                          ? "Loading. . ."
                          : "Based on your journal entry, your feelings are " +
                            emotions[0] +
                            ", " +
                            emotions[1] +
                            ", and " +
                            emotions[2]
                      }
                      readOnly={true}
                      rows={5}
                      cols={80}
                      placeholder="Your emotions will display here"
                      className="resize-none rounded-2xl bg-white p-4 w-full text-black text-xl"
                    >
                      <h1>{aiResponse}</h1>
                    </textarea>
                  ) : (
                    <textarea
                      value={""}
                      readOnly={true}
                      rows={5}
                      cols={80}
                      placeholder="Result"
                      className="resize-none rounded-2xl bg-white p-4 w-full text-black text-xl"
                    ></textarea>
                  )}
                </div>

                <div>
                  <h3 className="text-sub-yellow text-4xl font-bold mb-3">
                    Response
                  </h3>
                  {showResult ? (
                    <textarea
                      value={
                        loadingParagraph ? "Loading. . ." : finalAIResponse
                      }
                      readOnly={true}
                      rows={12}
                      cols={80}
                      placeholder="Result"
                      className="resize-none rounded-2xl bg-white p-4 w-full text-black text-xl"
                    >
                      <h1>{aiResponse}</h1>
                    </textarea>
                  ) : (
                    <textarea
                      value={""}
                      readOnly={true}
                      rows={12}
                      cols={80}
                      placeholder="Response to you will display here"
                      className="resize-none rounded-2xl bg-white p-4 w-full text-black text-xl"
                    ></textarea>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <> </>
          )}

          {show == "history" ? (
            <div className="w-full rounded-2xl gap-5 grid grid-cols-3">
              <div className="bg-main-green p-6 col-span-2 rounded-xl h-full">
                <div className="space-y-3">
                  <h1 className="text-yellow-200 font-bold">Journal Entry:</h1>
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
          <div className="flex justify-end p-3 space-x-4">
            <button
              onClick={handleClear}
              className="clear m-0 bg-slate-400 hover:bg-slate-300 p-4 text-lg rounded-xl"
            >
              Clear All Results
            </button>
          </div>
        ) : (
          <> </>
        )}

        {show == "history" ? (
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShow("log")}
              className="clear m-0 bg-sub-yellow p-4 rounded-xl font-bold w-1/12 text-xl hover:bg-yellow-500 mt-3"
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
