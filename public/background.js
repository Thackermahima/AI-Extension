chrome.action.onClicked.addListener(async (tab) => {
  const { id: tabId } = tab;

  chrome.scripting.executeScript(
    {
      target: { tabId },
      function: scrapeWebpage,
    },
    (results) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      const webpageContent = results[0].result;

      chrome.tabs.sendMessage(tabId, { action: 'scrape', webpageContent });
    }
  );
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'askQuestion') {
    const { question, webpageContent } = message;
    fetchAnswer(question, webpageContent)
      .then((answer) => {
        chrome.tabs.sendMessage(sender.tab.id, { action: 'answer', answer });
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

function scrapeWebpage() {
  return document.documentElement.outerHTML;
}

async function fetchAnswer(question, webpageContent) {
  const response = await fetch('https://api.openai.com/v1/answers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.REACT_APP_OPENAI_API_KEY,
    },
    body: JSON.stringify({
      question,
      context: webpageContent,
      model: 'davinci',
      max_tokens: 100,
    }),
  });
  const data = await response.json();
  return data.answers[0].text;
}



