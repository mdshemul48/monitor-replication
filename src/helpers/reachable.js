import ping from "ping";

export default async function isReachable(ipAddress) {
  try {
    const response = await ping.promise.probe(ipAddress);

    return response.alive;
  } catch (error) {
    return false;
  }
}
