import { div, hh } from 'react-hyperscript-helpers';
import Radium from 'radium';
import Events from './EventsComponent';
import TimeRange from './TimeRange';

const Calendar = ({events}) => div([TimeRange(), Events({events})])	;

export default hh(Radium(Calendar));
