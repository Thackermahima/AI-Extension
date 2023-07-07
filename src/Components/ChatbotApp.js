// import { useState, useEffect } from "react"
// import { Configuration, OpenAIApi } from "openai";
// import axios from "axios";

// const ChatbotApp = () => {
//   const configuration = new Configuration({
//     apiKey: process.env.REACT_APP_OPENAI_API_KEY,
//   });

//   const openai = new OpenAIApi(configuration);
//   const [prompt, setPrompt] = useState("");
//   const [apiResponse, setApiResponse] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [pageContent, setPageContent] = useState("");

//   useEffect(() => {
//   const fetchData = async() => {
//    try {
//     const response = await axios.get(window.location.href);
//     console.log(response, "fetchData");
//     const parser = new DOMParser();
//     const htmlDoc = parser.parseFromString(response.data, "text/html");
//     const pageText = htmlDoc.body.textContent;
//     setPageContent(pageText);
//    } catch (error) {
//     console.error("Error fetching page content:", error);
//   }
//   }
//   fetchData();
//   }, [])
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const result = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: pageContent + "\nUser Question: " + prompt,
//         temperature: 0.5,
//         max_tokens: 4000,
//       });
//       console.log(result, "result");
//       //console.log("response", result.data.choices[0].text);
//       setApiResponse(result.data.choices[0].text);
//     } catch (e) {
//       //console.log(e);
//       setApiResponse("Something is going wrong, Please try again.");
//     }
//     setLoading(false);
//   };


//   return (
//     <div className="chatbot-container">
//       <form onSubmit={handleSubmit}>
//         <textarea
//           className="chatbot-input"
//           type="text"
//           value={prompt}
//           placeholder="Please ask OpenAI"
//           onChange={(e) => setPrompt(e.target.value)}
//         ></textarea>
//               <div className="button-container">

//         <button
//           className="chatbot-button"
//           disabled={loading || prompt.length === 0}
//           type="submit"
//         >
//           {loading ? "Generating..." : "Generate"}
//         </button>
//         </div>
//       </form>

//       {apiResponse && (
//   <div className="chatbot-response">
//   <div className="response-heading-container">
//   <div className="speech-bubble"></div>
//   <h2 className="response-heading">Behold! The AI Speaks:</h2>
// </div>    <div className="response-container">
//       {apiResponse.split('\n').map((response, index) => (
//         response.trim().length > 0 && (
//           <p key={index}>{response}</p>
//         )
//       ))}
//     </div>
//   </div>
// )}
//     </div>
//   );
// };


// export default ChatbotApp;
import { useState, useEffect } from "react";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import cheerio from "cheerio";

const ChatbotApp = () => {
  //const cheerio = require('cheerio');

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);
  const [prompt, setPrompt] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageContent, setPageContent] = useState("");
  const [scrapedData, setScrapedData] = useState(null);

  useEffect(() => {
    const handlePostMessage = (event) => {
      if (event.data && event.data.type === "SCRAPE_RESULT") {
        const data = event.data.data;
        setScrapedData(data);
      }
    };

    window.addEventListener("message", handlePostMessage);

    return () => {
      window.removeEventListener("message", handlePostMessage);
    };
    // const fetchData = async () => {
    //   chrome.tabs.query({ active: true, currentWindow: true}, async(tabs) => {
    //     const tabUrl = tabs[0].url;
    //   try {
    //     const response = await axios.get(tabUrl);
    //     const html = await response.text();
    //     const $ = cheerio.load(html);
    //     const pageText = $("body").text();
    //     const html = response.data;
    //     setPageContent(html);
    //   } catch (error) {
    //     console.error("Error fetching page content:", error);
    //   }
    // });
    // };
    // fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.postMessage({ type: "USER_QUESTION", data: prompt }, "*");

    setLoading(true);
    //const promptWithScrapedData = `Scraped Data: ${JSON.stringify(scrapedData)} \nUser Question: ${prompt}`
    try {
      const result = await openai.createCompletion({
        model: "text-davinci-003",
       // prompt: pageContent + "\nUser Question: " + prompt,
       prompt: `Scraped Data: ${JSON.stringify(scrapedData)} \nUser Question: ${prompt}`,
       temperature: 0.5,
        max_tokens: 4000,
      });
      setApiResponse(result.data.choices[0].text);
    } catch (e) {
      console.error("Error generating AI response:", e);
      setApiResponse("Something is going wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="chatbot-container">
      <form onSubmit={handleSubmit}>
        <textarea
          className="chatbot-input"
          type="text"
          value={prompt}
          placeholder="Please ask OpenAI"
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>
        <div className="button-container">
          <button
            className="chatbot-button"
            disabled={loading || prompt.length === 0}
            type="submit"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </form>

      {apiResponse && (
        <div className="chatbot-response">
          <div className="response-heading-container">
            <div className="speech-bubble"></div>
            <h2 className="response-heading">Behold! The AI Speaks:</h2>
          </div>
          <div className="response-container">
            {apiResponse.split("\n").map((response, index) => (
              response.trim().length > 0 && <p key={index}>{response}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotApp;