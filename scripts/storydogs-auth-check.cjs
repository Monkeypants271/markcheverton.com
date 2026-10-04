/* eslint-disable @typescript-eslint/no-require-imports -- Standalone regression entry point. */
// Stateless regression uses an isolated production server and temporary environment
// credentials. The owner's saved password configuration is never modified.
require('./storydogs-production-check.cjs');
