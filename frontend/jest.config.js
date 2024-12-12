module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(js|jsx)$": "esbuild-jest"
    },
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
        "axios": "axios/dist/node/axios.cjs"
      },
      "scripts": {
        "test": "jest"
      }
  };
  