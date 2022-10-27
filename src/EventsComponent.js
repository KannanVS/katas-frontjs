import { div, hh } from "react-hyperscript-helpers";
import Radium from "radium";
import Event from "./Event";
import typography from "./styles";

const styles = {
  events: {
    border: `1px solid ${typography.color.grid}`,
    display: "inline-block",
    width: 1200,
    height: 1200,
    paddingLeft: 10,
    paddingRight: 10,
    position: "relative",
    backgroundImage: `linear-gradient(to bottom, ${typography.color.background}, ${typography.color.background}, 60px, #FFFF 1px, ${typography.color.grid})`,
    backgroundSize: "100% 20px",
  },
};

const Events = ({ events }) =>
  div({ style: [styles.events] }, position(events));

// check events overlap occurance
const isEventsOverlap = (row, event) => {
  const partialOverlap = (row, event) =>
    (event.start > row.start && event.start < row.end) ||
    (event.end > row.start && event.start < row.end);
  const fullOverlap = (row, event) =>
    (event.start >= row.start && event.end <= row.end) ||
    (event.start < row.start && event.end > row.end);

  return partialOverlap(row, event) || fullOverlap(row, event);
};

const position = (events) => {
  /**
   * Create rows for the given events
   * for given the rows to create columns of events
   * the details of the events can be mapped to position the event in calendar
   * position is done by params: top, width and left
   * top: indicates the starting point (aka) top boundary of an event
   * width: size (or) ratio of the event in a given row
   * left: indicates the space left at the left of the event to align with other events
   */
  const rows = createRows(events);
  return Object.keys(rows).map((rowKey) => {
    if (rows.hasOwnProperty(rowKey)) {
      return rows[rowKey]
        .sort(sortEvent)
        .reduce(createColumns, [])
        .map((column, index, columns) => {
          const { width } = styles.events;
          let eventWidth = Math.floor(width / columns.length);

          let remainingColumns;
          if (rowKey === rows[rowKey][0]?.start + "-" + rows[rowKey][0]?.end) {
            remainingColumns = columns
              .filter((column, index) => index !== 0)
              .flat();
          }
          return column.map((event) => {
            const otherColumns = remainingColumns
              ?.filter((remainingColumn) => remainingColumn !== event)
              .flat();
            if (
              column.length === 1 &&
              (otherColumns === undefined || otherColumns.length === 0)
            ) {
              const positioning = {
                top: event?.start,
                width: eventWidth,
                left: index * eventWidth,
              };
              return Event({ event, positioning });
            }
            if (
              event === column[0] &&
              otherColumns &&
              otherColumns.length > 2 &&
              otherColumns.every(
                (otherColumn) => otherColumn.start <= event.end
              )
            ) {
              eventWidth = Math.floor(width / columns.length);
              const positioning = {
                top: event?.start,
                width: eventWidth,
                left: index * eventWidth,
              };
              return Event({ event, positioning });
            }
            if (
              otherColumns &&
              otherColumns.length &&
              otherColumns.every(
                (otherColumn) => otherColumn.end <= event.start
              )
            ) {
              eventWidth = Math.floor(width / columns.length);
              const positioning = {
                top: event?.start,
                width: width - eventWidth,
                left: eventWidth,
              };
              return Event({ event, positioning });
            }
            const positioning = {
              top: event?.start,
              width: eventWidth,
              left: index * eventWidth,
            };
            return Event({ event, positioning });
          });
        });
    }

    return [];
  });
};

const createColumns = (columns, nextEvent) => {
  const column = findExistingColumn();

  return column ? addToExistingColumn() : addANewColumn();

  function addToExistingColumn() {
    const appendedColumn = [...column, nextEvent];

    return [
      ...columns.slice(0, columns.indexOf(column)),
      appendedColumn,
      ...columns.slice(columns.indexOf(column) + 1),
    ];
  }

  function addANewColumn() {
    return [...columns, [nextEvent]];
  }

  function findExistingColumn() {
    return columns.find((column) =>
      column.every((event) => event.end < nextEvent?.start)
    );
  }
};

const sortEvent = (a, b) => {
  return a.start - b.start || b.end - a.end;
};

const createRows = (events) => {
  return events.reduce((rows, event) => {
    const conflictingRows = Object.keys(rows)
      .map(keyToEvent)
      .filter((row) => isEventsOverlap(row, event));

    const conflictingEvents = [].concat.apply(
      [],
      conflictingRows.map((row) => rows[eventToKey(row)])
    );

    const mergedRow = mergeRows(conflictingRows, conflictingEvents, event);

    const newRows = Object.keys(rows).reduce((newRows, rowKey) => {
      const timeslot = keyToEvent(rowKey);

      if (
        conflictingRows.some(
          (conflictingRow) =>
            conflictingRow.start === timeslot.start &&
            conflictingRow.end === timeslot.end
        )
      ) {
        return newRows;
      }

      newRows[rowKey] = rows[rowKey];
      return newRows;
    }, mergedRow);

    return newRows;
  }, {});

  function mergeRows(conflictingRows, conflictingEvents, event) {
    const mergedRow = {};
    const mergedRowKey = eventToKey(conflictingRows.reduce(mergeRowKey, event));
    const mergedEvents = conflictingEvents.concat(event);
    mergedRow[mergedRowKey] = mergedEvents;
    return mergedRow;
  }

  function mergeRowKey(mergedRow, row) {
    return {
      start: mergedRow.start <= row.start ? mergedRow.start : row.start,
      end: mergedRow.end >= row.end ? mergedRow.end : row.end,
    };
  }

  function eventToKey(event) {
    return event.start + "-" + event.end;
  }

  function keyToEvent(key) {
    const [start, end] = key.split("-").map((x) => parseInt(x, 10));
    return { start, end };
  }
};

export default hh(Radium(Events));
