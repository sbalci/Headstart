import dateFormat from "dateformat";

export const getDateTimeFromTimestamp = (timestamp) => {
  if (typeof timestamp !== "string" || !timestamp) {
    return "";
  }

  const date = getDateFromTimestamp(timestamp);
  const time = getTimeFromTimestamp(timestamp);

  if (!date) {
    return "";
  }

  return `on ${date} at ${time}`;
};

export const getDateFromTimestamp = (timestamp) => {
  if (typeof timestamp !== "string" || !timestamp) {
    return "";
  }

  const date = parseTimestamp(timestamp);

  try {
    return dateFormat(date, "d mmm yyyy");
  } catch (error) {
    console.warn(error);
    return "";
  }
};

export const getTimeFromTimestamp = (timestamp) => {
  if (typeof timestamp !== "string" || !timestamp) {
    return "";
  }

  const date = parseTimestamp(timestamp);

  try {
    return dateFormat(date, "H:MM");
  } catch (error) {
    console.warn(error);
    return "";
  }
};

const parseTimestamp = (timestamp) => {
  if (isNaN(new Date(timestamp))) {
    timestamp = timestamp.trim().replace(/\s+/, "T");
  }

  return new Date(timestamp);
}
