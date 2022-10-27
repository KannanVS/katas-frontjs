import { div, hh } from "react-hyperscript-helpers";
import Radium from "radium";
import moment from "moment";
import typography from "./styles";

const styles = {
  timeRange: {
    display: "inline-block",
    width: "60px",
    height: "720px",
    paddingRight: "10px",
  },

  tick: {
    display: "block",
    height: "100px",
  },

  time: {
    paddingTop: "10px",
    display: "inline-block",
    width: "70%",
    height: "30px",
    textAlign: "right",
    verticalAlign: "sub",
  },

  period: {
    display: "inline-block",
    float: "right",
    width: "30%",
    lineHeight: "30px",
    height: "30px",
    textAlign: "right",
  },
};

const Period = ({ period }) =>
  div(
    { style: [styles.period, typography.subscript, typography.period] },
    period
  );

const Tick = (date) => {
  const time = date.format("h:mm");
  const period = date.format("A");

  return div({ style: styles.tick }, [
    div(
      ".tick",
      { style: [styles.time, typography.strong, typography.time] },
      time
    ),
    Period({ period }),
  ]);
};

const TimeRange = () => {
  const times = Array.apply(null, Array(13))
    .map((_, i) => i + 9)
    .map((hour) => new Date(2022, 10, 27, hour))
    .map((date) => moment(date));

  const ticks = [].concat.apply(
    times.map((time, index) => {
      return [Tick(time)];
    })
  );

  return div({ style: [styles.timeRange] }, ticks);
};

export default hh(Radium(TimeRange));
