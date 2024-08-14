async function sendAlert(apiEndpoint, message) {
  const payload = { message }; // "Replication has stopped on MySQL slave server"

  try {
    const response = await axios.post(apiEndpoint, payload);
    if (response.status === 200) {
      console.log("Alert sent successfully");
    } else {
      console.log(
        `Failed to send alert: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Request failed:", error.message);
  }
}

export default sendAlert;
