import './App.css';
import Calendar from './Calendar';
import data from './json/input.json';

// events to be rendered in calendar
const events = data.map((event) => {
  const { id, start, duration } = event;
  const [ hour, min ] = start.split(':');

  const startTime = (hour - 9) * 100 + (min / 60) * 100;
  return {
    title: id,
    start: Math.floor(startTime),
    end: Math.floor(startTime + (duration / 60) * 100),
  }
});

function App() {
  return (
    <>
      <Calendar
      events={events}
      />
    </>
  );
}

export default App;
