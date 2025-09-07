export const formatDate = (date) => {
  const d = new Date(date);
  const month = d.toLocaleString('en-US', { month: 'long' });
  const year = d.getFullYear();
  return `${month} ${year}`;
};

export const formatTime = (date) => {
  const givenDate = new Date(date);
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  return givenDate.toLocaleTimeString('en-US', options);
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};