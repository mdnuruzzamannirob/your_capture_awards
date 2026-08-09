module.exports = {
  apps: [
    {
      name: 'your-capture-awards',
      script: './node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      exec_mode: 'fork',
      instances: 1,
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
