import { format, endOfMonth, getDay, differenceInCalendarDays, differenceInHours } from 'date-fns';

import type { DaysInWeek } from '@/types';

/**
 ** Combines the given month and year into a Date object representing the last day of that month.
 * @param month - The month as a number (1 for January, 2 for February, etc.).
 * @param year - The year as a four-digit number.
 * @returns A Date object representing the last day of the specified month and year.
 */
export const combineDate = (month: number, year: number): Date => {
  const firstDayOfNextMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = endOfMonth(firstDayOfNextMonth);
  return new Date(format(lastDayOfMonth, 'yyyy-MM-dd'));
};

/**
 ** Calculates the number of days between two dates, inclusive.
 * @param from - The start date.
 * @param to - The end date.
 * @returns The number of days between the two dates, including both the start and end dates.
 */
export const getNumberOfDays = (from: Date, to: Date): number =>
  differenceInCalendarDays(new Date(to), new Date(from)) + 1;

/**
 ** Calculates the difference in hours between the given date and the current date.
 * @param date - The date to compare with the current date.
 * @returns The difference in hours between the given date and the current date.
 */
export const calculateHoursDifference = (date: Date): number => {
  const currentDate = new Date();
  return differenceInHours(date, currentDate);
};

/**
 ** Returns the day of the week for a given date.
 * @param date - The date object for which to get the day of the week.
 * @returns The day of the week as a string, which can be one of the following:
 * 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'.
 */
export const getDayOfWeek = (date: Date): DaysInWeek => {
  // getDay returns an integer from 0 (Sunday) to 6 (Saturday)
  const daysOfWeek: DaysInWeek[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  return daysOfWeek[getDay(date)];
};

/**
 ** Formats a time range into a 12-hour format with AM/PM notation and appends the time zone.
 * @param startTime - The start time in 24-hour format (e.g., "14:00").
 * @param endTime - The end time in 24-hour format (e.g., "16:00").
 * @param timeZone - The time zone to append (e.g., "PST").
 * @returns A string representing the formatted time range with the time zone (e.g., "2 PM - 4 PM PST").
 */
export const formatTimeRange = (startTime: string, endTime: string, timeZone: string): string => {
  const format12Hour = (time: string): string => {
    const [hour] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour} ${period}`;
  };
  return `${format12Hour(startTime)} - ${format12Hour(endTime)} ${timeZone.toUpperCase()}`;
};

/**
 ** Formats a date range into a string representation.
 * @param from - The start date of the range.
 * @param to - The end date of the range.
 * @returns A string representing the formatted date range, e.g., "June 8th - 16th".
 */
export const formatDateRange = (from: Date, to: Date): string => {
  const startDate = format(from, 'MMMM do'); // "June 8th"
  const endDate = format(to, 'do'); // "16th"
  return `${startDate} - ${endDate}`;
};
