chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    const {id, parameters} = message;
    console.log(id + ' | ' + parameters);
});

addEventListener('scroll', (event) => {
    console.log(document
        .getElementById('comments')
        ?.getElementsByClassName('style-scope yt-formatted-string')[0]);
});

function waitForElm(selector: string): Promise<Element> {
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
            childList: true,
            subtree: true,
        });
    });
}
