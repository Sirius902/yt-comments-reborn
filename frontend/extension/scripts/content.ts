chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const {id, parameters} = message;
    console.log(id + "|" + parameters);
});
