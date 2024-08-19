import ping from "ping";

export default async function isReachable(ipAddress) {
  try {
    const response = await ping.promise.probe(ipAddress);

    return response.alive;
  } catch (error) {
    return false;
  }
}

export async function checkServerReachability(host, serverType) {
  if (!(await isReachable(host))) {
    throw new Error(
      `${serverType} server at ${host} is unreachable. It might be offline or there could be a network issue.`
    );
  }
}
