import React from "react";
import events from "./events.js";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import config from './config/config';

moment.locale("fr");
const localizer = momentLocalizer(moment);

const formats = {
  // hide event time range in the calendar
  eventTimeRangeFormat: () => { 
    return "";
  },
};

const { date, month, year } = config;

function App() {
  /**
   * calendar component displays {events} in 'day' view.
   * defaultDate is set through config.
   * fromats is used to change an existing format in calendar
   */
  return (
    <div style={{ height: 700 }}>
    <Calendar
      events={events}
      formats={formats}
      step={30}
      defaultView="day"
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      defaultDate={new Date(year, month, date)}
      dayLayoutAlgorithm="no-overlap"
    />
  </div>
  );
}

export default App;
