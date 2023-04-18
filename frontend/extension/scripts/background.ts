console.log("testing");

async function getTab() {
    let queryOptions = { active: true, currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);
    return tabs[0].url;
}

chrome.tabs.onActivated.addListener(function () {
    console.log("TAB UPDATED")
    getTab().then(url => {
        console.log(url);
    });
});
