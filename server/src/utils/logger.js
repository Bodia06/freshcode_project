const fs = require('fs');
const { LOGS_DIR, ERRORS_LOG_PATH: LOG_FILE } = require('../constants');

const ensureLogDirExists = () => {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
};

const saveErrorToLog = async err => {
  ensureLogDirExists();

  const errorLog = {
    message: err.message || 'Unknown Error',
    time: Date.now(),
    code: err.code || err.status || 500,
    stackTrace: {
      stack: err.stack || 'No stack trace available',
    },
  };

  const logEntry = JSON.stringify(errorLog) + '\n';

  try {
    await fs.promises.appendFile(LOG_FILE, logEntry);
  } catch (fileError) {
    console.error('Failed to write to log file:', fileError);
  }
};

module.exports = saveErrorToLog;
