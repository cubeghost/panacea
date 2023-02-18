// eslint-disable-next-line @typescript-eslint/no-var-requires
const { config } = require('@netlify/remix-edge-adapter');

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ...config,
  serverDependenciesToBundle: [
    'query-string',
    'decode-uri-component',
    'split-on-first',
    'filter-obj',
    // 'nanoid',
  ],
};
