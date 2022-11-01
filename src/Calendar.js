import './assests/calendar.css';
import { foramattedTimerange, renderedEvents} from "./helpers/calendarHelper";

// Calendar Component
const Calendar = () => {
  const timeSlots = foramattedTimerange.map((timeSlot, index) => (
    <div className="Time-item" key={index}>
      {timeSlot}
    </div>
  ));

  // returns timeslots and rendered events
  return (
    <div className="Calendar">
      {timeSlots}
      {renderedEvents}
    </div>
  );
};

export default Calendar;
