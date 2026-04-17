import fs from 'fs';
import path from 'path';

const USAGE_FILE = path.join(process.cwd(), 'ai-usage.json');
const RPD_LIMIT = 20; // Gemini 2.5 Flash free tier

interface UsageData {
  date: string;
  count: number;
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
}

function readUsage(): UsageData {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      const raw = fs.readFileSync(USAGE_FILE, 'utf-8');
      const data: UsageData = JSON.parse(raw);
      if (data.date === getTodayString()) {
        return data;
      }
    }
  } catch {
    // ignore read/parse errors
  }
  return { date: getTodayString(), count: 0 };
}

function writeUsage(data: UsageData): void {
  try {
    fs.writeFileSync(USAGE_FILE, JSON.stringify(data), 'utf-8');
  } catch {
    // ignore write errors
  }
}

export function incrementAiUsage(): UsageData & { remaining: number; limit: number } {
  const usage = readUsage();
  usage.count += 1;
  writeUsage(usage);
  return { ...usage, remaining: Math.max(0, RPD_LIMIT - usage.count), limit: RPD_LIMIT };
}

export function getAiUsage(): UsageData & { remaining: number; limit: number } {
  const usage = readUsage();
  return { ...usage, remaining: Math.max(0, RPD_LIMIT - usage.count), limit: RPD_LIMIT };
}
