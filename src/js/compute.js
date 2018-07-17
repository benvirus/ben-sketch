const removeFromList = (list, { judge, value }) => {
  let isFinded = false;
  const rule = judge.rule || function(a, b) {
    return a === b;
  };
  for (let i = 0; i < list.length; i += 1) {
    const drawItem = list[i].options;
    if (drawItem[judge.key] && rule(value, drawItem[judge.key])) {
      list.splice(i, 1);
      i -= 1;
      isFinded = true;
    }
  }
  return isFinded;
}

export { removeFromList };