export const joinRecordAndRemoveDuplicateById = (arr, notice) => {
  const newArray = [notice, ...arr];
  let uniqueIds = new Set();
  let uniqueArray = [];

  newArray.forEach(item => {
    if (!uniqueIds.has(item.id)) {
      uniqueIds.add(item.id);
      uniqueArray.push(item);
    }
  });

  return uniqueArray;
}