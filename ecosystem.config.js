module.exports = {
    apps: [{
      name: 'Telemetry',
      script: './src/server.js',
      time: true,
      node_args: '-r dotenv/config',
    }],
  };
