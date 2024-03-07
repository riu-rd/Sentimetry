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
    <section>
      <h1>Home</h1>
      <fieldset>
        <form onSubmit={onSubmitText}>
          <h3>Emotion from a Sentence</h3>
          <input type='text' placeholder='Enter a Sentence' onChange={handleSentenceChange} value={sentence}/>
          <button type='submit'>Submit Text</button>
        </form>
        <h3>Result</h3>
        <p>{loadingSentence ? "Loading. . ." : sentenceResult}</p>
      </fieldset>

      <fieldset>
        <form onSubmit={onSubmitParagraph}>
          <h3>Emotion from a Paragraph</h3>
          <textarea rows={13} cols={50} placeholder='Enter a Paragraph' onChange={handleParagraphChange} value={paragraph}/>
          <button type='submit'>Submit Paragraph</button>
        </form>
        <h3>Result</h3>
        <textarea value={loadingParagraph ? "Loading. . ." : paragraphResult} readOnly={true} rows={10} cols={80} />
      </fieldset>
      
      <button onClick={handleLogout} className='clear'>Log Out</button>
      <button onClick={handleClear} className='clear'>Clear All Results</button>
    </section>
  )
}

export default Home;