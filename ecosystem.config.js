module.exports = {
  apps: [
    {
      name: 'your-capture-awards',
      // On the server APP_DIR points at the `current` symlink (see deploy/remote-deploy.sh),
      // so every restart follows the symlink to the newest release.
      cwd: process.env.APP_DIR || __dirname,
      script: './node_modules/next/dist/bin/next',
      args: `start -p ${process.env.PORT || 3000}`,
      exec_mode: 'fork',
      instances: 1,
      interpreter: 'node',
      max_memory_restart: '1G',
      kill_timeout: 10000,
      time: true,
      env: {
        NODE_ENV: 'production',
        NEXT_TELEMETRY_DISABLED: '1',
      },
    },
  ],
};
