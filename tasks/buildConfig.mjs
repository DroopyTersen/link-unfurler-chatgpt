export default {
  entryPoints: ['src/server.js'],
  bundle: true,
  platform: "node",
  external: ['./node_modules/*'],
  outfile: 'build/server.js',
}