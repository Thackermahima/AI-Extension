//     /*global chrome*/
// import React, { useState, useEffect } from 'react';

// function ChatbotPopup() {
//     const [question, setQuestion] = useState('');
//     const [aiResponse, setAiResponse] = useState('');
//     useEffect(() => {
//         chrome.runtime.onMessage.addListener((message) => {
//           // Handle the received AI response
//           if (message.aiResponse) {
//             const airesponse = message.aiResponse;
//             setAiResponse(airesponse);
//             // Update the UI with the AI response
//           }
//         });
//       }, []);

//   const handleSubmit = () => {
//     // Send the user's question to the background script
//     chrome.runtime.sendMessage({ question });
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={question}
//         onChange={(e) => setQuestion(e.target.value)}
//       />
//       <button onClick={handleSubmit}>Submit</button>
//       <p>{aiResponse}</p>
//     </div>
//   );
// }

// export default ChatbotPopup;
import React, { useEffect, useState } from 'react';

function ChatbotPopup() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    console.log(question, "question");
    console.log(answer,"answer");
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleMessage = (event) => {
    if (event.source === window && event.data.action === 'answer') {
      const receivedAnswer = event.data.answer;
      setAnswer(receivedAnswer);
    }
  };

  const handleQuestionSubmit = () => {
    // Send the question to the content script
    window.postMessage({ action: 'askQuestion', question }, '*');
  };

  return (
    <div>
      <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
      <button onClick={handleQuestionSubmit}>Ask</button>
      <p>Answer: {answer}</p>
    </div>
  );
}

export default ChatbotPopup;
