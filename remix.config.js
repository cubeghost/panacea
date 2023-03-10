/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: 'netlify',
  server:
    process.env.NETLIFY || process.env.NETLIFY_LOCAL
      ? './server.js'
      : undefined,
  ignoredRouteFiles: ['**/.*'],
  serverDependenciesToBundle: [
    'query-string',
    'decode-uri-component',
    'split-on-first',
    'filter-obj',
    'nanoid',
  ],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: ".netlify/functions-internal/server.js",
  // publicPath: "/build/",
};
