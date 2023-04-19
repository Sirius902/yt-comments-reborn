chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    const {id, parameters} = message;
    console.log(id + " | " + parameters);

});

addEventListener("scroll", (event) => {

    console.log(document.getElementById("comments")?.getElementsByClassName("style-scope yt-formatted-string")[0]);

});


function waitForElm(selector: any) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}