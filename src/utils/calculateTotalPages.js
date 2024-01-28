export const calculateTotalPages = (totalItems, itemsPerPage) => {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / itemsPerPage);
}