console.log("testing");
let queryParameters: string = "";
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == "complete") {
        if (tab.url && tab.url.includes("youtube.com/watch")) {
            queryParameters = tab.url.split("?v=")[1];
            console.log(queryParameters);
        }
        chrome.tabs.sendMessage(tabId, { id: tabId, parameters: queryParameters });
    }
});
