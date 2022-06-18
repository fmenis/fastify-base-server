module.exports = {
  apps: [
    {
      name: 'name',
      cwd: '/opt/name',
      script: 'index.js',
      node_args: '-r dotenv/config',
      env: {
        NODE_ENV: 'staging',
      },
      exp_backoff_restart_delay: 100,
      max_memory_restart: '500M',
      max_restarts: 10,
      error_file: '/var/log/name/err.log',
      out_file: '/var/log/name/out.log',
      log_file: '/var/log/name/combined.log',
    },
  ],
}
