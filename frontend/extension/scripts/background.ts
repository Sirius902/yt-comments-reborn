chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete') {
        if (tab.url && tab.url.includes('youtube.com/watch')) {
            const queryParameters = tab.url;
            chrome.identity.getAuthToken({interactive: true}, function (token) {
                chrome.tabs.sendMessage(tabId, {
                    id: tabId,
                    parameters: queryParameters,
                    token: token,
                });
            });
        }
    }
});
