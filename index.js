var child_process = require('child_process')

module.exports = function (args, callback) {
  switch (args[0]) {
    // Help output
    case undefined:
    case 'help':
    case '--help':
    case '-h':
      callback(null, [
        'Usage:',
        '  in [MINUTES] [MESSAGE]',
        '',
        'Example:',
        '  in 10 put the milk back in the fridge'
      ].join('\n'))
      break

    // List existing jobs
    case 'list':
    case '--list':
      child_process.exec('ps aux | grep -e "# queued message$" | grep -v grep', function (err, out) {
        // Errors just mean no jobs were found, ignore them
        callback(null, out)
      })
      break

    // Create a new job
    default:
      var delay = parseInt(args.shift(), 10) * 60
      var sleep = 'sleep ' + delay + '; '

      var message = args.join(' ')
      var notify = 'osascript -e \'display notification "' + message + '" with Title "Reminder"\''

      var command = sleep + notify + ' # queued message'

      child_process.exec(command).unref()
      callback()
  }
}
