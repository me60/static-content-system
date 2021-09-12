# Max E's Content Challenge Submission

## Build Instructions

To run locally with NPM installed, use:

`npm run serve`

..in the top-level directory, this will run the front end of the site on a free port. Visit the URL specified on the command line in a browser of your choosing. To hook up the back-end, use:

`node server.js`

..in the 'src' directory. Once the front end is refreshed, a request called to the node server will serve files and folders under the 'content' directory. From there, the site will provide instructions on how to navigate.

Ensure that the 'PATH_SLASH' constant in "src/App.vue" and "src/server.js" is set to the correct delimiter for your operating system. I have developed this in Windows, and thus, have set this constant to a backslash.