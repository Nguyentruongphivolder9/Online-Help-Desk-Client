export const convertDateHourAndMinute = (dateString) => {
  const dateObject = new Date(dateString)

  const day = dateObject.getDate()
  const month = dateObject.getMonth() + 1
  const year = dateObject.getFullYear()
  const hours = dateObject.getHours().toString()
  const minutes = dateObject.getMinutes().toString()

  let formattedDate;
  if (minutes.length < 2 && hours.length < 2) {
    formattedDate = `0${hours}:0${minutes} ${day}/${month}/${year}`
  } else if (minutes.length < 2 && hours.length > 1) {
    formattedDate = `${hours}:0${minutes} ${day}/${month}/${year}`
  } else if (hours.length < 2 && minutes.length > 1) {
    formattedDate = `0${hours}:${minutes} ${day}/${month}/${year}`
  } else {
    formattedDate = `${hours}:${minutes} ${day}/${month}/${year}`
  }

  return formattedDate
}
