import './App.css';
import Calendar from './Calendar';
import { TimeRange, events } from './helpers/AppHelper';

function App() {
  return (
    <div className="App">
      <Calendar data={{timeSlots: TimeRange(), events}}/>
    </div>
  );
}

export default App;
