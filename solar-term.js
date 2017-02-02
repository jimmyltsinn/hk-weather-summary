let unorm = require('unorm');

let map = {
  1 : unorm.nfd('小寒'),
  2 : unorm.nfd('大寒'),
  3 : unorm.nfd('立春'),
  4 : unorm.nfd('雨水'),
  5 : unorm.nfd('驚蟄'),
  6 : unorm.nfd('春分'),
  7 : unorm.nfd('清明'),
  8 : unorm.nfd('穀雨'),
  9 : unorm.nfd('立夏'),
  10 : unorm.nfd('小滿'),
  11 : unorm.nfd('芒種'),
  12 : unorm.nfd('夏至'),
  13 : unorm.nfd('小暑'),
  14 : unorm.nfd('大暑'),
  15 : unorm.nfd('立秋'),
  16 : unorm.nfd('處暑'),
  17 : unorm.nfd('白露'),
  18 : unorm.nfd('秋分'),
  19 : unorm.nfd('寒露'),
  20 : unorm.nfd('霜降'),
  21 : unorm.nfd('立冬'),
  22 : unorm.nfd('小雪'),
  23 : unorm.nfd('大雪'),
  24 : unorm.nfd('冬至')
};

let get_id = (name) => {
  for (let key in map) {
    if (unorm.nfd(map[key]) === unorm.nfd(name)) {
      return key;
    }
  }
  console.error([name]);
  return -1;
  // throw -1;
};

let get_name = (id) => {
  if (id < 1) return undefined;
  if (id > 24) return undefined;
  return map[id];
};

module.exports = {
  map: map,
  get_name: get_name,
  get_id: get_id
};
