let str =
  '["to some extent; somewhat.","an unspecified number or amount of people or things.","at least a small amount or number of people or things.","an unspecified amount or number of."]';

let string = str
  .slice(1, str.length - 1)
  .split(',')
  .map(singleItem => singleItem.slice(1, singleItem.length - 1));

console.log(string);
