import { render } from '@testing-library/react';
import App from './App';
import data from './json/input.json';


test('renders learn react link', async () => {
  const {container} = render(<App />);

  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  const events = container.getElementsByClassName('Event-box');

  // check events rendered is equal to input events
  expect(events.length).toEqual(data.length);
});
