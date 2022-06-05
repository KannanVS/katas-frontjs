import { render, screen } from '@testing-library/react';
import App from './App';
import config from './config/config';
import moment from "moment";
moment.locale("fr");

const { date, month, year } = config;
const expectedDate = moment(new Date(year, month, date)).format("dddd MMMM DD");

test('renders learn react link', () => {
  render(<App />);
  // test expectedDate is rendered correctly
  const linkElement = screen.getByText(new RegExp(expectedDate, "i"));
  expect(linkElement).toBeInTheDocument();
});
