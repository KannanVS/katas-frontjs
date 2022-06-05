import data from './json/input.json';
import config from './config/config';
import moment from "moment";

moment.locale("fr");

// json data is formatted to be displayed in calendar
const formattedInput = data.map((event) => {
  const { id, start, duration } = event;
  const [ hour, min ] = start.split(':');
  const { date, month, year } = config;
  /**
   * - title
   *    {id} will be display in the event slot
   * - start time of the event
   *    year, month and date is fetched from config (which also matches the default date of calendar)
   *    hour and min is fetched from the data
   * - end time of the event
   *    calculated by adding 'duration' to the start time
   */
  const startTime = new Date(year, month, date, hour, min);
  return {
    title: id,
    start: startTime,
    end: new Date(moment(startTime).add(duration, "m")),
  }
});

export default formattedInput;
