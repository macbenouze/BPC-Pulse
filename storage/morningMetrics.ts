import AsyncStorage from '@react-native-async-storage/async-storage';

export type MetricsData = {
  heartRate: number;
  sleepQuality: number;
  wellness: number;
};

const PREFIX = 'metrics:';
const ONE_DAY = 24 * 60 * 60 * 1000;

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export async function saveMetrics(data: MetricsData, date = new Date()): Promise<void> {
  const key = PREFIX + formatDate(date);
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

export async function getMetrics(date = new Date(Date.now() - ONE_DAY)): Promise<MetricsData | null> {
  const key = PREFIX + formatDate(date);
  const json = await AsyncStorage.getItem(key);
  return json ? (JSON.parse(json) as MetricsData) : null;
}
