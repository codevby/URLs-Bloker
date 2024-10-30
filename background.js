chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleAdBlock") {
      chrome.storage.local.set({ adBlockEnabled: message.enabled });
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["content.js"]
          });
        }
      });
    }
  });
  