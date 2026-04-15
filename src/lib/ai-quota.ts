import fs from 'fs';
import path from 'path';

const QUOTA_FILE = path.join(process.cwd(), 'ai-quota.json');
const DAILY_LIMIT = 20;

type QuotaData = {
  date: string; // YYYY-MM-DD in Pacific Time
  used: number;
};

function getPacificDate(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
}

function readQuota(): QuotaData {
  try {
    const raw = fs.readFileSync(QUOTA_FILE, 'utf-8');
    return JSON.parse(raw) as QuotaData;
  } catch {
    return { date: getPacificDate(), used: 0 };
  }
}

function writeQuota(data: QuotaData) {
  fs.writeFileSync(QUOTA_FILE, JSON.stringify(data), 'utf-8');
}

function getOrResetQuota(): QuotaData {
  const stored = readQuota();
  const today = getPacificDate();
  if (stored.date !== today) {
    const fresh = { date: today, used: 0 };
    writeQuota(fresh);
    return fresh;
  }
  return stored;
}

export function getQuotaStatus(): { used: number; remaining: number; limit: number } {
  const quota = getOrResetQuota();
  return {
    used: quota.used,
    remaining: Math.max(0, DAILY_LIMIT - quota.used),
    limit: DAILY_LIMIT,
  };
}

export function incrementQuota(): void {
  const quota = getOrResetQuota();
  quota.used += 1;
  writeQuota(quota);
}
