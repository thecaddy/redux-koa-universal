/* eslint-disable no-console, no-use-before-define */

import path from 'path';
// import Express from 'express';
import koa from 'koa'
import qs from 'qs';

import webpack from 'webpack';
import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import webpackConfig from '../webpack.config';

import React from 'react';
import { Provider } from 'react-redux';

import configureStore from '../common/store/configureStore';
import App from '../common/containers/App';
import { fetchCounter } from '../common/api/counter';

// const app = new Express();
const app = new koa()
const port = 3000;

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

// This is fired every time the server side receives a request
app.use(handleRender);

function*handleRender(next) {
  // Query our mock API asynchronously
  let apiResult = yield fetchCounter()
    // Read the counter from the request, if provided
  const params = qs.parse(this.query);
  const counter = parseInt(params.counter, 10) || apiResult || 0;

  // Compile an initial state
  const initialState = { counter };

  // Create a new Redux store instance
  const store = configureStore(initialState);

  // Render the component to a string
  const html = React.renderToString(
    <Provider store={store}>
      { () => <App/> }
    </Provider>
  );

  // Grab the initial state from our Redux store
  const finalState = store.getState();

  // Send the rendered page back to the client
  this.body = yield renderFullPage(html, finalState);
}

function*renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});
