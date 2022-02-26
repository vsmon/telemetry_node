module.exports = {
    apps: [{
      name: 'Telemetry',
      script: './src/server.js',      
      node_args: '-r dotenv/config',
    }],
  };