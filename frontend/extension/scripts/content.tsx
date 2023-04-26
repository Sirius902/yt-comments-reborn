import React from "react";
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './app';
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
        .then((message) => {
            message.remove();
        });
    waitForElem(document.body, '#comments')
        .then((comments) => {
            const app = document.createElement('div');
            app.id = 'react-root';
            if (comments) {
                comments.prepend(app);
            }
            const root = createRoot(app);
            root.render(
                <App />
            )
        });
});

// addEventListener('scroll', (event) => {
//     console.log(document
//         .getElementById('comments')
//         ?.getElementsByClassName('style-scope yt-formatted-string')[0]);
// });
