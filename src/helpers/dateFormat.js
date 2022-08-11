export default function dateFormat(date, time = false) {
  let options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  if (time)
    options = {
      ...options,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

  return new Intl.DateTimeFormat("ru-RU", options).format(date);
}
