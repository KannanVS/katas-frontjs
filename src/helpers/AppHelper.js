import moment from "moment";
import data from "../json/input.json";

const formatTimerange = (date) => {
  const time = date.format("h:mm");
  const period = date.format("A");
  return `${time} ${period}`;
};

// Display time range from 9AM - 9PM
const TimeRange = () => {
  const times = Array.apply(null, Array(13))
    .map((_, i) => i + 9)
    .map((hour) => new Date(2022, 10, 29, hour))
    .map((date) => moment(date));

  const foramattedTimerange = [].concat
    .apply(
      times.map((time, index) => {
        return [formatTimerange(time), ""];
      })
    )
    .flat();

  return foramattedTimerange;
};

/**
 * events to be rendered in calendar
 * 1hr time duration is given as 100px
 * Thus, (min / 60) * 100 is used to calculate minute to px
 */
const events = data.map((event) => {
  const { id, start, duration } = event;
  const [hour, min] = start.split(":");

  const startTime = (hour - 9) * 100 + (min / 60) * 100;
  return {
    title: id,
    start: Math.floor(startTime),
    end: Math.floor(startTime + (duration / 60) * 100),
  };
});

export { TimeRange, events };
