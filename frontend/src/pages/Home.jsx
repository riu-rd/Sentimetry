import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { db } from '../../firebase.js';
import axios from "axios";
import predictEmotions from "../hooks/predictEmotions";
import { collection, addDoc, getDocs } from "firebase/firestore";

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
    const [aiResponse, setAiResponse] = useState('');
    const [show, setShow] = useState('log')
    const [emotions, setEmotions] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [logs, setLogs] = useState([]);

    const auth = getAuth();
    const logsCollectionRef = collection(db, `users/${auth.currentUser?.uid}/logs`);

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
        setShowResult(false)
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
          })
          // @ts-ignore
          setLogs(current);
          console.log("Logs retrieved successfully");
        })
        .catch((err) => {
          console.error(err);
        })
    }


    // When submit button is clicked
    const onSubmitParagraph = (e) => {
        e.preventDefault();
        setShowResult(true)
        setLoadingParagraph(true);
        predictEmotions(paragraph)
            .then((response) => {
                setParagraphResult('');
                const jsonData = response.predictions; // Access the 'predictions' property
    
                // Initialize variables for the emotion with the highest score
                const sortedEmotions = jsonData.sort((a, b) => b.score - a.score);
    
                const top3Emotions = sortedEmotions.slice(0, 3);
                console.log(typeof(top3Emotions))
                console.log(top3Emotions)
                const emotions = []
                top3Emotions.forEach((entry, index) => {
                    
                    emotions.push(entry.label)
                })

                // @ts-ignore
                setEmotions(emotions)
                console.log(top3Emotions)
                // generate the response based on the emotion identified
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
                setParagraphResult(top3Emotions[0].label);
                
                const prompt = `the user wrote : ${paragraph}
                The user portrays the emotion/emotions: ${top3Emotions[0].label}. Using the information provided above, respond, give advice, and symphatize witht he users
                entry by using the sample responses below as a foundation. ${`${top3Emotions[0].label}Responses`}. Make your final output personalized, no bias, and is related to
                the emotions of the user. 
                `;
                console.log("prompt " + prompt);
        
                // axios.post('https://sentimetry-api.onrender.com/get-response', { text: prompt })
                // .then((res) => {
                //     console.log("Response of AI: ", res.data.response);
                //     setAiResponse(res.data.response);
                // })
                // .catch((err) => {
                //     console.error(err);
                // });
            })
    };
    
    // When there is AI response, store the log
    useEffect(() => {
        if (aiResponse) {
          const emotionString = emotions.join(', ');
          addDoc(logsCollectionRef, {
            log: paragraph,
            emotions: emotionString,
            response: aiResponse,
            date: new Date().toISOString().split('T')[0],
          })
          .then(() => {
            alert("Logged Successfully!")
            retrieveLogs();
            setParagraph('');
        })
          .catch((err) => {
            console.error(err);
            alert("Logging Unsuccessful!");
          });
        }
      }, [aiResponse]);

    // Retrieve logs upon page load
    useEffect(() => {
        retrieveLogs();
    }, []);

    // CONSOLE IF retrieveLogs is working
    useEffect(() => {
        console.log("Logs: ", logs)
        logs.forEach((log, index) => {
            console.log("Index: ", index, "Log: ",log.log)
        })
    }, [logs]);

  return (
    <div className="bg-background-green">
        <div className="w-screen m-0 p-4 ps-8 text-md bg-main-green">
            <h1 className="century-gothic">SentiMetry</h1>
        </div>
        <div className='p-10 px-28 h-screen'>
            <div className='mb-5'>
                <h1 style={{color:'#BE912B'}} className='font-bold'>LOGS</h1>
            </div>
            <div className='flex gap-10 h-4/5'>
                <div className='space-y-10 w-1/2 overflow-y-scroll'>
                    <div style={{backgroundColor:'#8DA290'}} className='rounded-2xl w-full p-4 h-max'
                            onClick={() => setShow('history')}>
                        <h3>
                            {/*place text here from database*/ }
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                        </h3>
                        <h4 className='text-end'>
                            1/1/2024
                            {/*place date here from database*/ }
                        </h4>
                    </div>

                    <div style={{backgroundColor:'#8DA290'}} className='rounded-2xl w-full p-4 h-max'>
                        <h3>
                            {/*place text here from database*/ }
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                        </h3>
                        <h4 className='text-end'>
                            1/1/2024
                            {/*place date here from database*/ }
                        </h4>
                    </div>

                    <div style={{backgroundColor:'#8DA290'}} className='rounded-2xl w-full p-4 h-max'>
                        <h3>
                            {/*place text here from database*/ }
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                        </h3>
                        <h4 className='text-end'>
                            1/1/2024
                            {/*place date here from database*/ }
                        </h4>
                    </div>

                    <div style={{backgroundColor:'#8DA290'}} className='rounded-2xl w-full p-4 h-max'>
                        <h3>
                            {/*place text here from database*/ }
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                        </h3>
                        <h4 className='text-end'>
                            1/1/2024
                            {/*place date here from database*/ }
                        </h4>
                    </div>


                    <div style={{backgroundColor:'#8DA290'}} className='rounded-2xl w-full p-4 h-max'>
                        <h3>
                            {/*place text here from database*/ }
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                        </h3>
                        <h4 className='text-end'>
                            1/1/2024
                            {/*place date here from database*/ }
                        </h4>
                    </div>

                    <div style={{backgroundColor:'#8DA290'}} className='rounded-2xl w-full p-4 h-max'>
                        <h3>
                            {/*place text here from database*/ }
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                        </h3>
                        <h4 className='text-end'>
                            1/1/2024
                            {/*place date here from database*/ }
                        </h4>
                    </div>

                    <div style={{backgroundColor:'#8DA290'}} className='rounded-2xl w-full p-4 h-max'>
                        <h3>
                            {/*place text here from database*/ }
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                        </h3>
                        <h4 className='text-end'>
                            1/1/2024
                            {/*place date here from database*/ }
                        </h4>
                    </div>

                    <div style={{backgroundColor:'#8DA290'}} className='rounded-2xl w-full p-4 h-max'>
                        <h3>
                            {/*place text here from database*/ }
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                        </h3>
                        <h4 className='text-end'>
                            1/1/2024
                            {/*place date here from database*/ }
                        </h4>
                    </div>

                    <div style={{backgroundColor:'#8DA290'}} className='rounded-2xl w-full p-4 h-max'>
                        <h3>
                            {/*place text here from database*/ }
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                        </h3>
                        <h4 className='text-end'>
                            1/1/2024
                            {/*place date here from database*/ }
                        </h4>
                    </div>

                    <div style={{backgroundColor:'#8DA290'}} className='rounded-2xl w-full p-4 h-max'>
                        <h3>
                            {/*place text here from database*/ }
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                        </h3>
                        <h4 className='text-end'>
                            1/1/2024
                            {/*place date here from database*/ }
                        </h4>
                    </div>

                    <div style={{backgroundColor:'#8DA290'}} className='rounded-2xl w-full p-4 h-max'>
                        <h3>
                            {/*place text here from database*/ }
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                        </h3>
                        <h4 className='text-end'>
                            1/1/2024
                            {/*place date here from database*/ }
                        </h4>
                    </div>
                    
                </div>

                {show == 'log' ? (  
                    <div className='w-full'>
                        <h2 style={{color:'#BE912B'}} className='text-4xl font-bold mb-3'>How Are You Feeling?</h2>
                        <fieldset className='space-y-6'>
                            <form onSubmit={onSubmitParagraph}>
                                <textarea rows={10} cols={50} placeholder='Enter a Paragraph' onChange={(e) => handleParagraphChange(e)} value={paragraph}
                                        className='rounded-2xl p-4 w-full bg-white mb-3 text-black text-xl'/>
                                <button style={{backgroundColor:'#BE912B'}} type='submit'
                                        className='font-bold text-2xl p-4 m-0 rounded-2xl'>Submit</button>
                            </form>
                            <div>
                                <h3 style={{color:'#BE912B'}} className='text-4xl font-bold mb-3'>Result</h3>
                                {showResult ? (
                                    <textarea value={loadingParagraph ? "Loading. . ." : "Based on your journal entry, your feelings are " + emotions[0] + ', ' + emotions[1] + ', and ' +  emotions[2] + ". I want you to know that " + aiResponse} readOnly={true} rows={10} cols={80} 
                                        placeholder='Result' className='rounded-2xl bg-white p-4 w-full text-black text-xl'>
                                        <h1>{aiResponse}</h1>
                                    </textarea>
                                ) : (<textarea value={""} readOnly={true} rows={10} cols={80} placeholder='Result' className='rounded-2xl bg-white p-4 w-full text-black text-xl'> </textarea>)}
                                
                            </div>
                        </fieldset>
                    </div>
                ) : (<> </>)}

                {show == 'history' ? (  
                    <div style={{backgroundColor:'#8DA290'}} className='w-full p-7 rounded-2xl'>
                        <h1>Journal Entry:</h1>
                        <h1>Emotion:</h1>
                        <h1>Response:</h1>
                    </div>
                ) : (<> </>)}

        

            </div>

            {show == 'log' ? (  
                    <div className='flex justify-end p-3 space-x-4'>
                        <button onClick={handleLogout} className='clear m-0'>Log Out</button>
                        <button onClick={handleClear} className='clear m-0'>Clear All Results</button>
                    </div>
            ) : (<> </>)}

            {show == 'history' ? (  
                <div className='flex justify-end p-3 space-x-4'>
                <button style={{background:'#BE912B'}} onClick={() => setShow('log')} className='clear m-0'>Done</button>
            </div>
            ) : (<> </>)}
        </div>
    </div>
  );
};

export default Home;
