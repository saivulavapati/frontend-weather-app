const config = {
    API_BASE_URL: "http://localhost:9000/api/v1",
}

export const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

export const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

export default config;