export const getInstrumentColor = (instrumentName) => {
  switch (instrumentName) {
    case "Drums":
      return "drumsColor";
    case "Guitar":
      return "guitarColor";
    case "Piano":
      return "pianoColor";
    default:
      return "defaultColor";
  }
};
