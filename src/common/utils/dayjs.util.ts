import dayjs from 'dayjs';
import 'dayjs/locale/lo';
dayjs.locale('lo');
export const formatDate = (date: Date) => {
  return dayjs(date).format('dddd DD-MM-YYYY');
};
