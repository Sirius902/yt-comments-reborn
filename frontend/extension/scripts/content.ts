// async function getTab() {
//     let queryOptions = { active: true, currentWindow: true };
//     let tabs = await chrome.tabs.query(queryOptions);
//     return tabs[0].url;
// }

async function test() {
    console.log(chrome.tabs);
}

(async() => {
    // var url =  await getTab();
    // console.log(url);
    test();
})();
