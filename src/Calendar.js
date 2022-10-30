import eventsPosition from "./helpers/CalendarHelper";

// Calendar Component
const Calendar = (props) => {
  const timeSlots = props.data.timeSlots.map((timeSlot, index) => (
    <div className="Time-item" key={index}>
      {timeSlot}
    </div>
  ));
  const renderedEvents = eventsPosition(props.data.events);

  // returns timeslots and rendered events
  return (
    <div className="Calendar">
      {timeSlots}
      {renderedEvents}
    </div>
  );
};

export default Calendar;
