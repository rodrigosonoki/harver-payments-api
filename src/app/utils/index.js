/* const body = [
  { sku: "abc", qty: 2 },
  { sku: "def", qty: 1 },
];

const db = []; */

function sum(arr1, arr2) {
  const a = arr1.concat(arr2);

  var temp = {};
  var obj = null;

  for (var i = 0; i < a.length; i++) {
    obj = a[i];

    if (!temp[obj.sku]) {
      temp[obj.sku] = obj;
    } else {
      temp[obj.sku].qty += obj.qty;
    }
  }

  var i = [];
  for (var prop in temp) i.push(temp[prop]);

  return i;
}

module.exports = {
  sum,
};
