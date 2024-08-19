export default function getCurrentDateTime() {
  const now = new Date();

  // Format the date and time
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  // Get the formatted date and time string
  return now.toLocaleString("en-US", options);
}
