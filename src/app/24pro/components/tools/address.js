import address from './address.json';

function formatData(province) {
  let data = province ? address[province] : address;
  let result = [];
  for (let key in data) {
    result.push({
      value: key
    });
  }
  return result;
}

export function provinceData(antPicker = false) {
  if (antPicker) {
    let result = [].concat(formatData());
    result.map(item => {
      item.label = item.value;
      return item;
    });
    return result;
  }
  return formatData();
}

/**
 * @deprecated 拼写错误，心里没点儿逼数么
 * @param province
 * @param antPicker
 * @returns {*[]}
 */
export function cityeData(province, antPicker = false) {
  if (antPicker) {
    let result = [].concat(formatData(province));
    result.map(item => {
      item.label = item.value;
      return item;
    });
    return result;
  }
  return formatData(province);
}

export function cityData(province, antPicker = false) {
  if (antPicker) {
    let result = [].concat(formatData(province));
    result.map(item => {
      item.label = item.value;
      return item;
    });
    return result;
  }
  return formatData(province);
}
