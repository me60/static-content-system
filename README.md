# Max E's Content Challenge Submission

## Build Instructions

To run locally with NPM installed, use:

`npm run serve`

If you don't have the following dependencies installed globally, the following are required:

`npm install @vue/cli-plugin-unit-jest @vue/test-utils`
`npm install express`

..in the top-level directory, this will run the front end of the site on a free port. Paste the URL given in the command line to the search bar of a browser of your choosing. To hook up the back-end, use:

`node server.js`

..in the 'src' directory. Once the front end is refreshed, a request called to the node server will serve files and folders under the 'content' directory. From there, the site will provide instructions on how to navigate.

Ensure that the 'PATH_SLASH' constant in "src/App.vue" and "src/server.js" is set to the correct delimiter for your operating system. I have developed this in Windows, and thus, have set this constant to a backslash.

## Testing

I planned on writing unit tests with Jest and Vue tooling, however, I ran into issues documented [here](https://www.gitmemory.com/issue/kayahr/jest-environment-node-single-context/5/857497636) and [here](https://giters.com/facebook/jest/issues/11792). It seems to be a fairly recent issue, with more time I could have pursued alternative unit testing routes.

As a substitute, I have added "Testing Proof" to show the application working with the test cases.