const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');
const {
  ERRORS_LOG_PATH: SOURCE_FILE,
  ARCHIVE_DIR_PATH: ARCHIVE_DIR,
} = require('../constants');

const ensureArchiveDir = async () => {
  try {
    await fs.access(ARCHIVE_DIR);
  } catch {
    await fs.mkdir(ARCHIVE_DIR, { recursive: true });
  }
};

const backupLogs = async () => {
  try {
    try {
      await fs.access(SOURCE_FILE);
    } catch (e) {
      console.log('Log file does not exist, skipping backup.');
      return;
    }

    const data = await fs.readFile(SOURCE_FILE, 'utf8');

    if (!data.trim()) return;

    await fs.writeFile(SOURCE_FILE, '');

    await ensureArchiveDir();

    const rawLines = data.split('\n').filter(line => line.trim() !== '');

    const transformedLogs = rawLines
      .map(line => {
        try {
          const parsed = JSON.parse(line);
          return {
            message: parsed.message,
            code: parsed.code,
            time: parsed.time,
          };
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);

    if (transformedLogs.length === 0) {
      console.log(
        'Log file cleared, but no valid JSON entries found to archive.'
      );
      return;
    }

    const timestamp = Date.now();
    const destinationFile = path.join(ARCHIVE_DIR, `${timestamp}_errors.json`);

    await fs.writeFile(
      destinationFile,
      JSON.stringify(transformedLogs, null, 2)
    );

    console.log(
      `Logs backed up to ${destinationFile} and source file cleared.`
    );
  } catch (error) {
    console.error('Error during log backup:', error);
  }
};

module.exports.startCronJob = () => {
  cron.schedule('41 15 * * *', () => {
    console.log('Starting daily log backup...');
    backupLogs();
  });
};
