console.log('testing');
let queryParameters = '';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete') {
        if (tab.url && tab.url.includes('youtube.com/watch')) {
            queryParameters = tab.url;
            chrome.tabs.sendMessage(tabId, {
                id: tabId,
                parameters: queryParameters,
            });
        }
    }
});
