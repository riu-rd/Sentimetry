import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from "firebase/auth";
import axios from 'axios';

const Home = () => {
  // Declarations
  const [sentence, setSentence] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [sentenceResult, setSentenceResult] = useState('');
  const [paragraphResult, setParagraphResult] = useState('');
  const [loadingSentence, setLoadingSentence] = useState(false);
  const [loadingParagraph, setLoadingParagraph] = useState(false);
  const auth = getAuth();

  // On change
  const handleSentenceChange = (e) => {
    setSentence(e.target.value);
  }

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
    setSentenceResult('');
  }

  // Submit Text
  const onSubmitText = (e) =>{
    e.preventDefault();

    setLoadingSentence(true);
    auth.currentUser?.getIdToken(true)
    .then((idToken) => {
      console.log("token: ", idToken)
      axios.post(`https://sentimetry-api.onrender.com/predict-text/${sentence}`, {}, {headers: {Authorization: `Bearer ${idToken}`}})
      .then((response) => {
        setSentence('');
        setSentenceResult(response.data.prediction);
        setLoadingSentence(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingSentence(false);
      })
    }).catch(function(error) {
        console.error(error);
        setLoadingSentence(false);
    });

    
    
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
      response.data.predictions.forEach((prediction) => {
        text += JSON.stringify(prediction) + '\n'
      })
      setParagraphResult(text);
      setParagraph('');
      setLoadingParagraph(false);
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
                            <textarea rows={13} cols={50} placeholder='Enter a Paragraph' onChange={handleParagraphChange} value={paragraph}
                                      className='rounded-2xl p-4 w-full bg-white mb-3'/>
                            <button style={{backgroundColor:'#BE912B'}} type='submit'
                                    className='font-bold text-2xl p-4 m-0 rounded-2xl'>Submit</button>
                        </form>
                        <div>
                            <h3 style={{color:'#BE912B'}} className='text-4xl font-bold mb-3'>Result</h3>
                            <textarea value={loadingParagraph ? "Loading. . ." : paragraphResult} readOnly={true} rows={10} cols={80} 
                                    placeholder='Result' className='rounded-2xl bg-white p-4 w-full'/>
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