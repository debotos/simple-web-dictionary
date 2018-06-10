module.exports = function mergeTwoArrayContent(ArrayOne, ArrayTwo) {
  // ArrayOne  [{1}, {}, {}, {}, {}, {}] english word array
  // ArrayTwo  [{3}, {}, {}, {}, {}, {}] other word array
  // Result    [{1, 3}, {}, {}, {}, {}, {}] Merge object content

  return ArrayOne.map(singleArrayOneItem => {
    singleArrayOneItem = {
      eng: singleArrayOneItem.word,
      ...singleArrayOneItem
    }; // Rename word to eng
    delete singleArrayOneItem['word'];
    let SameSerialArrayTwoData;
    ArrayTwo.forEach(singleArrayTwoItem => {
      if (singleArrayTwoItem.serial === singleArrayOneItem.serial) {
        delete singleArrayTwoItem['serial'];
        SameSerialArrayTwoData = {
          bangla: singleArrayTwoItem.word,
          ...singleArrayTwoItem
        }; // Rename word to bangla
        delete SameSerialArrayTwoData['word'];
      }
    });
    return { ...singleArrayOneItem, ...SameSerialArrayTwoData };
  });
};
