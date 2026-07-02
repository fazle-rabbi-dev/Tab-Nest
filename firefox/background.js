chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'switchTab') {
    chrome.tabs.update(message.tabId, { active: true });
  } else if (message.action === 'closeTab') {
    chrome.tabs.remove(message.tabId);
  }
});
