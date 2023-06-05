# YouTube Comments Reborn

## Trello Board

The Trello Board is [here](https://trello.com/b/a6EqNP3j/version-10).

## Building

* Install [Node.js](https://nodejs.org/) Current, which is 20.2.0 as of the current
commit.
* Clone this repository using [Git](https://git-scm.com/) or download the
[source code](https://github.com/Sirius902/yt-comments-reborn/archive/refs/heads/main.zip).
* Inside the root directory of the repository run the following commands.

```sh
npm install
npm run build
```

* The built backend distribution will be in `backend/build` and the frontend
distribution will be `frontend/extension`.

## Running Tests

* Install [Docker](https://www.docker.com/).
* After following the build instructions, start the database Docker container with the following commands.
  
```sh
cd backend
docker-compose up -d
cd ..
```

* Then, run all tests with the following command.
  
```sh
npm run test
```

**Note**: On Unix operating systems the `docker-compose` command may need to be run
with `sudo`.

## User Guide

* Follow the build instructions.
* Run the following commands to start the database Docker container. \[1\]

```sh
cd backend
docker-compose up -d
cd ..
```

* Start the backend server with the following commands in a new terminal.

```sh
cd backend
npm run start
```

* Download [Google Chrome](https://www.google.com/chrome/).
* Enable Developer mode for extensions at `chrome://extensions/` in Google Chrome.
* Install the `frontend/extension` directory as a Chrome Extension and enable it.
* Set the extension id on the Credentials page of the
[Google Cloud](https://console.cloud.google.com/getting-started?project=yt-comment-reborn)
control panel to match the installed extension id if necessary so that Google OAuth will function. \[2\]
* Go to a YouTube video with comments disabled or restricted and comments posted
through the extension will be visible and it will be possible to make new comments,
reply to comments, and like and dislike similar to the official YouTube comments
section.

A list of YouTube videos with comments, and some without, entered into the testing database includes the
following.

### Comments

* <https://www.youtube.com/watch?v=t-Nw9oz-U6M>
* <https://www.youtube.com/watch?v=YqLXRLCb3is>
* <https://www.youtube.com/watch?v=astISOttCQ0>

### No Comments

* <https://www.youtube.com/watch?v=qe7imy8dx8Q>

### **Note**

* \[1\] On Unix operating systems the `docker-compose` command may need to be run
with `sudo`.
* \[2\] Due to the fact that Google requires a paid developer account in order to
keep a consistent extension id across installations, in order to circumvent that,
the extension id must be set to match the installation.
