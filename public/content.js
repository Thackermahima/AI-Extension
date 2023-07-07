
document.addEventListener('DOMContentLoaded', function () {
  const questionButton = document.getElementById('questionButton');
  const questionInput = document.getElementById('questionInput');
  const answerOutput = document.getElementById('answerOutput');

  questionButton.addEventListener('click', function () {
    const question = questionInput.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      chrome.runtime.sendMessage({ action: 'askQuestion', question });
    });
  });

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'answer') {
      const answer = message.answer;
      answerOutput.textContent = answer;
    }
  });
});
