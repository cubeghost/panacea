
import React from 'react';
import cn from 'classnames';
import { eachDayOfInterval, startOfMonth, endOfMonth, startOfDay, isToday, getDate, getDay } from 'date-fns';
import type { Record } from '!@prisma/client';

interface CalendarProps {
  records: Record[];
}

const Calendar: React.FC<CalendarProps> = ({ records }) => {
  const now = new Date();

  const days = eachDayOfInterval({
    start: startOfMonth(now),
    end: endOfMonth(now),
  });

  const daysToRecordIds = {};
  records.forEach((record) => {
    const recordDays = record.endsAt ? eachDayOfInterval({
      start: startOfDay(record.startsAt),
      end: startOfDay(record.endsAt),
    }) : [startOfDay(record.startsAt)];

    recordDays.forEach((date) => {
      if (daysToRecordIds.hasOwnProperty(date)) {
        daysToRecordIds[date].push(record.id);
      } else {
        daysToRecordIds[date] = [record.id];
      }
    });
  });
  console.log(daysToRecordIds)

  return (
    <div className="month">
      {days.map((day) => {
        const date = getDate(day);
        const recordIds = daysToRecordIds[day];
        return (
          <div
            className={cn('day', {
              isToday: isToday(day),
              hasRecords: Boolean(recordIds),
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