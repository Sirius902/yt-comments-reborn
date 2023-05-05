import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';

function waitForElem(parent: Element, selector: string) {
    return new Promise<Element>((resolve) => {
        const element = parent.querySelector(selector);
        if (element !== null) {
            resolve(element);
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
}

function mountApp(comments: Element, videoId: string) {
    const reactRoot = document.getElementById('react-root');
    if (reactRoot === null) {
        const app = document.createElement('div');
        app.id = 'react-root';
        comments.append(app);
        const root = createRoot(app);
        root.render(
            <React.StrictMode>
                <App videoId={videoId} />
            </React.StrictMode>
        );
    }
}

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    const {parameters} = message;
    const url = new URL(parameters);
    const videoId = url.searchParams.get('v');

    if (videoId === null) {
        console.error('Video ID query param is null!');
        return;
    }

    waitForElem(document.body, '#message.ytd-message-renderer').then(
        (message) => {
            message.remove();

            waitForElem(document.body, '#comments').then((comments) => {
                mountApp(comments, videoId);

                const observer = new MutationObserver(() => {
                    mountApp(comments, videoId);
                });

                observer.observe(comments, {childList: true});
            });
        }
    );
});
