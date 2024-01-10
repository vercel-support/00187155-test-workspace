/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  watchPaths: () => require('@nx/remix').createWatchPaths(__dirname),
  serverModuleFormat: 'cjs',
  tailwind: true,
  serverDependenciesToBundle: [/.*/, /^remix-utils.*/],
}
