const waitForElem = (parent: Element, selector: string): Promise<Element> => {
    return new Promise((resolve) => {
        const element = parent.querySelector(selector);
        if (element !== null) {
            return resolve(element);
        }

        const observer = new MutationObserver(() => {
            const element = parent.querySelector(selector);
            if (element !== null) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(parent, {
            attributes: true,
            childList: true,
            subtree: true,
        });
    });
};

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    const {id, parameters} = message;
    console.log(id + ' | ' + parameters);
    waitForElem(document.body, '#message.ytd-message-renderer')
        .then((message) => console.log(message));
});

// addEventListener('scroll', (event) => {
//     console.log(document
//         .getElementById('comments')
//         ?.getElementsByClassName('style-scope yt-formatted-string')[0]);
// });
