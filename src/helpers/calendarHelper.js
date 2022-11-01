import moment from "moment";
import data from "../json/input.json";

const formatTimerange = (date) => {
  const time = date.format("h:mm");
  const period = date.format("A");
  return `${time} ${period}`;
};

// Display time range from 9AM - 9PM
const timeRange = Array.apply(null, Array(13))
  .map((_, i) => i + 9)
  .map((hour) => new Date(2022, 10, 29, hour))
  .map((date) => moment(date));

const foramattedTimerange = [].concat
  .apply(
    timeRange.map((time) => {
      return [formatTimerange(time), ""];
    })
  )
  .flat();

/**
 * events to be rendered in calendar
 * 1hr time duration is given as 100px
 * Thus, (min / 60) * 100 is used to calculate minute to px
 */
const events = data.map((event) => {
  const { id, start, duration } = event;
  const [hour, min] = start.split(":");

  const startTime = (hour - 9) * 100 + (min / 60) * 100;
  return {
    title: id,
    start: Math.floor(startTime),
    end: Math.floor(startTime + (duration / 60) * 100),
  };
});

// Event positioning
const boxStyle = (eventElement) => {
  return {
    height: eventElement.end - eventElement.start + "px",
    top: 50 + eventElement.start + "px",
    left: eventElement.left,
    width: eventElement.widthRatio + "%",
  };
};

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

// sort event by ascending order
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

const getEventBox = (event) => {
  return (
    <div className="Event-box" style={boxStyle(event)} key={event.title}>
      <div
        className="Event-item"
        style={{ top: event.end - event.start > 30 ? 10 : 0 }}
      >
        {event.title}
      </div>
    </div>
  );
};

/**
 * Create rows for the given events
 * for given the rows to create columns of events
 * the details of the events can be mapped to position the event in calendar
 * position is done by params: top, width, left and height
 * top: indicates the starting point (aka) top boundary of an event
 * width: size (or) ratio of the event in a given row
 * left: indicates the space left at the left of the event to align with other events
 * height: denotes the duration of event in px
 */
const eventsPosition = (events) => {
  const rows = createRows(events);

  return Object.keys(rows).map((rowKey) => {
    if (rows.hasOwnProperty(rowKey)) {
      return rows[rowKey]
        .sort(sortEvent)
        .reduce(createColumns, [])
        .map((column, index, columns) => {
          let eventsOverlapInGroup = [];
          if (columns[index + 1] && columns[index + 1].length) {
            eventsOverlapInGroup = columns.filter((col) =>
              isEventsOverlap(col[0], columns[index + 1][0])
            );
          } else {
            eventsOverlapInGroup = columns.filter((col) =>
              isEventsOverlap(col[0], column[0])
            );
          }

          //   some columns were a common overlap for two different event groups
          //   Example: events 2, 1, 8, 5
          const isSeperated = eventsOverlapInGroup.length !== columns.length;
          const width = 90;
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
            // single column without overlap
            // example event: 12
            if (
              columns.length === 1 &&
              (otherColumns === undefined || otherColumns.length === 0)
            ) {
              const eventElement = { ...event, widthRatio: width, left: 10 + "%" };
              return getEventBox(eventElement);
            }
            // first column of row and all other column of the row overlap
            if (
              event === column[0] &&
              otherColumns &&
              otherColumns.length > 2 &&
              otherColumns.every(
                (otherColumn) => otherColumn.start <= event.end
              )
            ) {
              // no different event groups
              if (!isSeperated) {
                const eventElement = {
                  ...event,
                  widthRatio: eventWidth,
                  left: 10 + (eventWidth * index) + "%",
                };
                return getEventBox(eventElement);
              }
              // column is common to different event groups
              // example event: 2
              eventWidth = Math.floor(width / (columns.length - 1));
              const eventElement = {
                ...event,
                widthRatio: eventWidth,
                left: 10 + eventWidth * index + "%",
              };
              return getEventBox(eventElement);
            }
            // other columns in event row
            if (
              otherColumns &&
              otherColumns.length &&
              otherColumns.every(
                (otherColumn) => otherColumn.end <= event.start
              )
            ) {
              // example event: 3
              if (!isSeperated) {
                const eventElement = {
                  ...event,
                  widthRatio: width - eventWidth,
                  left: 10 + eventWidth + "%",
                };
                return getEventBox(eventElement);
              }
              // overlap with a common event. so width is adjusted accordingly
              // example event: 5
              eventWidth = Math.floor(width / (columns.length - 1));
              const eventElement = {
                ...event,
                widthRatio: width - eventWidth,
                left: 10 + eventWidth + "%",
              };
              return getEventBox(eventElement);
            }
            // one or more overlapping event in same event group
            // example event: 13, 4
            if (!isSeperated) {
              const eventElement = {
                ...event,
                widthRatio: eventWidth,
                left: 10 + eventWidth * index + "%",
              };
              return getEventBox(eventElement);
            }
            // one or more overlapping event with a common overlapping event with another group
            // example event: 1, 8
            eventWidth = Math.floor(width / (columns.length - 1));
            const eventElement = {
              ...event,
              widthRatio: eventWidth,
              left: 10 + eventWidth * index + "%",
            };
            return getEventBox(eventElement);
          });
        });
    }

    return [];
  });
};

// events were rendered as elements using eventsPosition
const renderedEvents = eventsPosition(events);

export { foramattedTimerange, renderedEvents };
