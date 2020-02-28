export const getServingModelKey = (experimentId, registeredModelName) => {
  if (experimentId === null || experimentId === undefined) {
    return `model=${registeredModelName}`;
  } else {
    return `experiment=${experimentId}`;
  }
};
