
import cn from 'classnames';
import {eachDayOfInterval, startOfMonth, endOfMonth, isToday, getDate, getDay} from 'date-fns';

const Calendar = () => {
  const now = new Date();

  const days = eachDayOfInterval({
    start: startOfMonth(now),
    end: endOfMonth(now),
  });

  return (
    <div className="month">
      {days.map((day) => {
        const date = getDate(day);
        return (
          <div
            className={cn('day', {
              isToday: isToday(day),
            })}
            style={{
              gridColumn: getDay(day) + 1,
            }}
            key={date}
          >
            {date}
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;