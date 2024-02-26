export const convertDateHourAndMinute = (dateString) => {
  const dateObject = new Date(dateString);

  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();

  const formattedDate = `${hours}:${minutes} ${day}/${month}/${year}`;

  return formattedDate;
}