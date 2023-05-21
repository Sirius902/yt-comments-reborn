chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete') {
        if (tab.url && tab.url.includes('youtube.com/watch')) {
            const queryParameters = tab.url;
            chrome.identity.getAuthToken({interactive: true}, (token) => {
                chrome.tabs.sendMessage(tabId, {
                    parameters: queryParameters,
                    token: token,
                });
            });
        }
    }
});
