import dayjs from 'dayjs';
import 'dayjs/locale/lo';
dayjs.locale('lo');
export const formatDate = (date: Date) => {
  return dayjs(date).format('dddd DD-MM-YYYY');
};

export function calculateDays(
  startDate?: string | null|Date,
  endDate?: string | null |Date,
): number {
  if (!startDate || !endDate) return 0;
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const diff = end.diff(start, 'day');
  return diff > 0 ? diff : 0;
}
