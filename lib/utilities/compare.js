/**
 * A generic comparator function, for use with the sort method. Works with Strings and Numbers.
 * @param  {Any}     a First item to be compared
 * @param  {Any}     b Second item to be compared
 * @return {Integer}   Returns 1 if the first item is greater, -1 if the first item is lesser, and 0 if the two items are the same.
 */
function compare(a, b) {
  if (a < b) return -1;
  if (a > b) return +1;
  return 0;
}

module.exports = compare;
