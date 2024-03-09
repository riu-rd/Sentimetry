import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from "firebase/auth";
import axios from 'axios';

const admirationResponses = [
    "I'm truly impressed by your words. You have a way of inspiring greatness.",
    "Your insights are admirable. Keep shining with your unique perspectives.",
    "Wow, your achievements are truly remarkable. I'm in awe!",
    "You're doing amazing things. I admire your dedication and passion.",
    "It's clear you have a special talent. Your work is truly admirable.",
];

const amusementResponses = [
    "Haha, that's hilarious! Your sense of humor always brightens my day.",
    "You have a knack for bringing joy. Your wit and humor are on point!",
    "I can't help but smile at your words. Laughter is the best medicine!",
    "You've got a great sense of humor. Your lightheartedness is infectious.",
    "Your amusing stories never fail to entertain. Thanks for the laughter!"
]

const angerResponses = [
    "I sense frustration in your words. It's okay to feel upset. Let's talk it out.",
    "I can feel the intensity. Take a deep breath and let's discuss what's bothering you.",
    "Anger is a powerful emotion. Let's find a constructive way to address it together.",
    "I sense your frustration. It's important to express and manage anger healthily.",
    "Your anger is valid. Let's work through it and find a positive outlet."
]

const annoyanceResponses = [
    "Seems like something is bothering you. Let's chat about what's on your mind.",
    "I sense a bit of annoyance. What's going on? Let's talk it out.",
    "Annoyance happens to the best of us. Share your thoughts, and we'll work through it.",
    "It looks like something is irking you. I'm here to listen and help.",
    "Feeling annoyed? Let's address the source and find a solution together."
]

const approvalResponses = [
    "Great job! Your efforts are truly appreciated.",
    "I'm impressed by your work. Keep up the excellent job!",
    "You're doing fantastic! Your hard work is paying off.",
    "Your achievements deserve recognition. Well done!",
    "I approve of your approach. Keep moving forward with confidence."
]

const caringResponses = [
    "I can sense a caring tone in your words. Your compassion is heartwarming.",
    "Your empathy shines through. It's clear you genuinely care about others.",
    "Your caring nature is a beautiful trait. Keep spreading kindness.",
    "I appreciate your concern. Your caring attitude makes a difference.",
    "Your words reflect a deep sense of care. It's wonderful to see."
]

const confusionResponses = [
    "It seems like there's some confusion. Let's work together to clarify things.",
    "Confusion is a natural part of learning. Let's untangle the knots together.",
    "I sense uncertainty. Let's break down the confusion and find clarity.",
    "Feeling a bit lost? I'm here to help guide you through any confusion.",
    "Confusion happens to the best of us. Let's tackle it step by step."
]

const curiousityResponses = [
    "Your curiosity is inspiring. Let's explore together and satisfy your inquisitive mind.",
    "I love your curiosity! Asking questions is the first step to discovering new things.",
    "Curiosity is a wonderful trait. What would you like to explore or learn more about?",
    "Your inquisitive nature is a strength. Let's dive into the wonders of your curiosity.",
    "I can sense your eagerness to learn. Let's satisfy that curiosity together."
]

const desireResponses = [
    "I sense a strong desire in your words. What goals are you passionate about right now?",
    "Your determination is palpable. What do you desire most in this moment?",
    "Desire is a powerful motivator. Let's channel that energy towards your aspirations.",
    "Your aspirations are clear. What steps can we take to fulfill your desires?",
    "I can feel the intensity of your desires. Let's work towards making them a reality."
]

const disappointmentResponses = [
    "I sense some disappointment. It's okay to feel this way. Let's talk about it.",
    "Disappointment is a tough emotion. I'm here to support you through it.",
    "Your feelings of disappointment are valid. Let's explore how to move forward.",
    "I'm sorry to hear you're feeling disappointed. Let's discuss what happened.",
    "Disappointment is a part of life. How can we turn this moment around?"
]

const disapprovalResponses = [
    "It seems like you're expressing disapproval. Let's discuss what's bothering you.",
    "I can sense your concerns. What aspects are you disapproving of?",
    "Disapproval can be challenging. Let's talk about your feelings and find a resolution.",
    "I'm here to listen to your concerns and understand your sense of disapproval.",
    "Your disapproval is noted. Let's work together to address any issues."
]

const disgustResponses = [
    "I sense a strong reaction of disgust. What triggered this emotion for you?",
    "Disgust can be a powerful emotion. Let's explore what's causing this reaction.",
    "Your feelings of disgust are acknowledged. Let's discuss the source and find a solution.",
    "I'm here to support you through any discomfort. What specifically is bothering you?",
    "Disgust is a natural response. Let's address the issue and find a way forward."
]

const embarassmentResponses = [
    "I sense some embarrassment. It happens to everyone. Let's navigate through it together.",
    "Embarrassment is a common emotion. Let's discuss what happened and how to move on.",
    "Your feelings of embarrassment are understood. Let's find a way to ease the discomfort.",
    "I'm here to support you through moments of embarrassment. We all experience it.",
    "Embarrassment is a temporary feeling. Let's focus on the lessons learned and move forward."
]

const excitementResponses = [
    "Your excitement is contagious! What's sparking this enthusiasm?",
    "I can feel the energy in your words. What's got you so excited?",
    "Excitement is a wonderful emotion. Let's celebrate and explore this positive energy.",
    "Your enthusiasm is uplifting. What's bringing you so much joy and excitement?",
    "I love the excitement in your words. Let's keep that positive energy flowing!"
]

const fearResponses = [
    "It seems like fear is present. Let's talk about what's causing this emotion and find support.",
    "Fear can be overwhelming. I'm here to help you navigate through it.",
    "Your feelings of fear are valid. Let's explore ways to address and overcome them.",
    "Fear is a natural response. Let's work together to understand and manage it.",
    "I understand that fear can be challenging. You're not alone; let's face it together."
]

const gratitudeResponses = [
    "Your gratitude warms my virtual heart. What are you feeling thankful for today?",
    "Expressing gratitude is a beautiful practice. What has sparked this feeling in you?",
    "I'm grateful for your kind words. What are you thankful for in this moment?",
    "Gratitude is a powerful emotion. Let's continue to cultivate a thankful mindset.",
    "I appreciate your gratitude. What positive experiences are you cherishing right now?"
]

const griefResponses = [
    "I sense a deep sorrow. Grieving is a process, and I'm here to support you.",
    "Grief is a heavy emotion. Let's talk about your feelings and find comfort together.",
    "I'm here for you during times of grief. How can I support you right now?",
    "Your feelings of loss are valid. Let's navigate through the grieving process together.",
    "Grief is a challenging emotion. Take your time, and I'm here whenever you're ready to talk."

]

const joyResponses = [
    "Your joy is contagious! What's bringing you so much happiness right now?",
    "I can feel the positive vibes in your words. What's contributing to your joy?",
    "Joy is a beautiful emotion. Let's celebrate the things that bring you happiness.",
    "Your happiness is uplifting. What joyful moments are you experiencing?",
    "I love the joy in your words. Let's savor these positive feelings together!"

]

const loveResponses = [
    "Your expression of love is heartwarming. What or who is filling your heart with love?",
    "Love is a beautiful emotion. How are you sharing and receiving love today?",
    "I sense a lot of love in your words. What's making your heart feel so full?",
    "Your love is felt and appreciated. How can we continue to nurture that love?",
    "Love is a powerful force. Let's explore the ways it's impacting your life."

]

const nervousnessResponses = [
    "Feeling a bit nervous? It's okay; we can work through it together.",
    "Nervousness is a common emotion. What's causing you to feel this way?",
    "I sense some nervous energy. Let's address the source and ease those nerves.",
    "Nervousness happens to the best of us. Take a deep breath, and we'll navigate through it.",
    "It's okay to feel nervous. I'm here to provide support and guidance."

]

const optimismResponses = [
    "Your optimism is inspiring. How can we channel this positive energy further?",
    "I love your optimistic outlook. What's fueling your positive mindset?",
    "Optimism is a powerful force. Let's focus on the bright side together.",
    "Your positive attitude is contagious. How can we amplify this optimism?",
    "I appreciate your optimistic perspective. Let's embrace the positivity!"

]

const prideResponses = [
    "I sense a lot of pride in your words. What achievements are you celebrating?",
    "Your pride is well-deserved. How can we continue to build on this success?",
    "Take pride in your accomplishments. You've earned it!",
    "Your sense of pride is evident. Let's explore the source of this achievement.",
    "I'm proud of your achievements. Keep up the excellent work!"

]

const realizationResponses = [
    "It seems like you've had a moment of realization. What insights have you uncovered?",
    "Realizations are powerful. What new perspectives have you gained?",
    "Your moment of realization is significant. How can we build on this newfound understanding?",
    "I appreciate your self-awareness. What realizations are guiding you right now?",
    "Realizing something new is a valuable experience. Let's explore its implications together."

]

const reliefResponses = [
    "I sense a feeling of relief. What has lifted a weight off your shoulders?",
    "Relief is a wonderful emotion. How can we maintain this sense of ease?",
    "I'm glad to hear you're feeling relief. Let's explore ways to sustain this positive state.",
    "Relief is a breath of fresh air. What contributed to this sense of calmness?",
    "I'm happy for your relief. Let's continue to cultivate moments of ease."

]

const remorseResponses = [
    "It seems like you're feeling remorseful. It's okay; we all make mistakes. Let's discuss it.",
    "Remorse is a challenging emotion. How can we learn and grow from this experience?",
    "I sense your regret. Let's explore ways to make amends and move forward positively.",
    "Feeling remorse is a human experience. Let's navigate through it together.",
    "Your feelings of remorse are valid. Let's address the situation and find a path to resolution."

]

const sadnessResponses = [
    "I sense a deep sadness. It's okay to feel this way. I'm here to support you.",
    "Sadness is a heavy emotion. Let's talk about what's on your mind and find comfort.",
    "I'm here for you during moments of sadness. How can I provide support?",
    "Your feelings of sadness are valid. Let's navigate through this difficult time together.",
    "Sadness is a part of life. Take your time, and I'm here whenever you're ready to talk."

]

const surpriseResponses = [
    "I can feel the surprise in your words. What unexpected event caught you off guard?",
    "Surprises can be delightful or shocking. What was your reaction to this surprise?",
    "Your sense of surprise is palpable. How can we explore and understand it together?",
    "I love the element of surprise. What unexpected twists have brightened your day?",
    "Surprise is a unique emotion. Let's embrace the unexpected and explore its impact."
]

const neutralResponses = [
    "I sense a neutral tone. How can we steer the conversation or explore a specific topic?",
    "A neutral state is a good starting point. What areas of interest would you like to explore?",
    "Neutrality is a blank canvas. Where shall we direct our conversation from here?",
    "A neutral mood provides flexibility. What topics or activities would you like to delve into?",
    "Your neutral stance allows for versatile conversations. What direction would you like to take?"
]

const Home = () => {
  // Declarations
  const [paragraph, setParagraph] = useState('');
  const [paragraphResult, setParagraphResult] = useState('');
  const [loadingParagraph, setLoadingParagraph] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [prompt, setPrompt] = useState("");
  const auth = getAuth();

  const handleParagraphChange = (e) => {
    setParagraph(e.target.value);
  }

  // Log out
  const handleLogout = () => {
    signOut(auth).then(() => {
      alert("Logged out Successfully");
    }).catch((err) => {
      alert('Log out error');
      console.error(err);
    });
  }

  // Clear Text
  const handleClear = () => {
    setParagraphResult('');
  }


  function getRandomResponse(responses) {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }



  // Submit Paragraph
  const onSubmitParagraph = (e) =>{
    e.preventDefault();

    setLoadingParagraph(true);
    axios.post(`https://sentimetry-api.onrender.com/predict-journal`, {
      text: paragraph
    })
    .then((response) => {
      setParagraphResult('');
      let text = ''
      const jsonData = response.data.predictions; // Access the 'predictions' property

        // Initialize variables for the emotion with the highest score
        let maxScore = -1;
        let emotion = "";

        // Iterate through the emotions in the data
        jsonData.forEach(entry => {
        if (entry.score > maxScore) {
            maxScore = entry.score;
            emotion = entry.label;
        }
      });
      console.log('checkpoint')
      // generate the response based on emotion identified
      switch (emotion){
        case 'admiration': setAiResponse(getRandomResponse(admirationResponses)); break;
        case 'amusement': setAiResponse(getRandomResponse(amusementResponses)); break;
        case 'anger': setAiResponse(getRandomResponse(angerResponses)); break;
        case 'annoyance': setAiResponse(getRandomResponse(annoyanceResponses)); break;
        case 'approval': setAiResponse(getRandomResponse(approvalResponses)); break;
        case 'caring': setAiResponse(getRandomResponse(caringResponses)); break;
        case 'confusion': setAiResponse(getRandomResponse(confusionResponses)); break;
        case 'curiousity': setAiResponse(getRandomResponse(curiousityResponses)); break;
        case 'desire': setAiResponse(getRandomResponse(desireResponses)); break;
        case 'disappointment': setAiResponse(getRandomResponse(disappointmentResponses)); break;

        case 'disapproval': setAiResponse(getRandomResponse(disapprovalResponses)); break;
        case 'disgust': setAiResponse(getRandomResponse(disgustResponses)); break;
        case 'embarasement': setAiResponse(getRandomResponse(embarassmentResponses)); break;
        case 'excitement': setAiResponse(getRandomResponse(excitementResponses)); break;
        case 'fear': setAiResponse(getRandomResponse(fearResponses)); break;
        case 'gratitude': setAiResponse(getRandomResponse(gratitudeResponses)); break;
        case 'grief': setAiResponse(getRandomResponse(griefResponses)); break;
        case 'joy': setAiResponse(getRandomResponse(joyResponses)); break;
        case 'love': setAiResponse(getRandomResponse(loveResponses)); break;
        case 'nervousness': break;

        case 'optimism': setAiResponse(getRandomResponse(optimismResponses)); break;
        case 'pride': setAiResponse(getRandomResponse(prideResponses)); break;
        case 'realization': setAiResponse(getRandomResponse(realizationResponses)); break;
        case 'relief': setAiResponse(getRandomResponse(reliefResponses)); break;
        case 'remorse': setAiResponse(getRandomResponse(remorseResponses)); break;
        case 'sadness': setAiResponse(getRandomResponse(sadnessResponses)); break;
        case 'surprise': setAiResponse(getRandomResponse(surpriseResponses)); break;
        case 'neutral': setAiResponse(getRandomResponse(neutralResponses)); break;
        default: setAiResponse('no emotion matched')



      }
      setPrompt(`The user wrote ${paragraph}, the user portrays the emotion: ${emotion}.
                 The task is to respond, give advice, and empathize with this entry by getting a
                 random response. The response is ${aiResponse}. Tailor this response in a way that it 
                 will sound personalized, no bias, with good intention, and is related to the emotion
                 ${emotion}.
      `)
      setParagraphResult(emotion);
      setParagraph('');
      setLoadingParagraph(false);

      axios
        .post("http://127.0.0.1:5000/api", { message: prompt })
        .then((res) => {
            setAiResponse(res.data)
        })
        .catch((err) => {
            console.log(err);
        });


    })
    .catch((err) => {
      console.error(err);
      setLoadingParagraph(false);
    })
  }

  return (
    <div style={{backgroundColor:'#DEE2D9'}} className=''>
        <div style={{backgroundColor:'#8DA290'}} className='w-screen m-0 p-4 ps-8 text-md'>
            <h1>SentiMetry</h1>
        </div>
        <div className='p-10 px-28'>
            <div className='mb-5'>
                <h1 style={{color:'#BE912B'}} className='font-bold'>LOGS</h1>
            </div>
            <div className='flex gap-10'>
                <div className='space-y-10 w-1/2'>
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

                <div className='w-full'>
                    <h2 style={{color:'#BE912B'}} className='text-4xl font-bold mb-3'>How Are You Feeling?</h2>
                    <fieldset className='space-y-6'>
                        <form onSubmit={onSubmitParagraph}>
                            <textarea rows={10} cols={50} placeholder='Enter a Paragraph' onChange={handleParagraphChange} value={paragraph}
                                      className='rounded-2xl p-4 w-full bg-white mb-3 text-black text-xl'/>
                            <button style={{backgroundColor:'#BE912B'}} type='submit'
                                    className='font-bold text-2xl p-4 m-0 rounded-2xl'>Submit</button>
                        </form>
                        <div>
                            <h3 style={{color:'#BE912B'}} className='text-4xl font-bold mb-3'>Result</h3>
                            <textarea value={loadingParagraph ? "Loading. . ." : "You're emotion is: " + paragraphResult + '\n' + aiResponse} readOnly={true} rows={10} cols={80} 
                                    placeholder='Result' className='rounded-2xl bg-white p-4 w-full text-black text-xl'>
                            </textarea>
                            
                        </div>
                    </fieldset>
                </div>

            </div>
            <div className='flex justify-end p-3 space-x-4'>
                <button onClick={handleLogout} className='clear m-0'>Log Out</button>
                <button onClick={handleClear} className='clear m-0'>Clear All Results</button>
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
  )
}

export default Home;