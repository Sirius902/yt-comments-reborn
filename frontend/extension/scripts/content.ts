const waitForElem = (selector: string): Promise<Element> => {
    return new Promise((resolve) => {
        const element = document.querySelector(selector);
        if (element !== null) {
            return resolve(element);
        }

        const observer = new MutationObserver((mutations) => {
            const element = document.querySelector(selector);
            if (element !== null) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true
        });
    });
}

chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    // const {id, parameters} = message;
    // console.log(id + ' | ' + parameters);
    const commentsDiv: Promise<Element> = waitForElem("#comments");
    if (commentsDiv !== null) {
        console.log(
            document.getElementById("comments")?.
            getElementsByClassName("style-scope yt-formatted-string")[0]
        );
    }
    
});

// addEventListener('scroll', (event) => {
//     console.log(document
//         .getElementById('comments')
//         ?.getElementsByClassName('style-scope yt-formatted-string')[0]);
// });
