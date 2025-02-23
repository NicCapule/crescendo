export const getInstrumentColor = (instrumentName) => {
  switch (instrumentName) {
    case "Drums":
      return "drumsColor";
    case "Guitar":
      return "guitarColor";
    case "Piano":
      return "pianoColor";
    case "Ukulele":
      return "ukuleleColor";
    case "Voice":
      return "voiceColor";
    case "Violin":
      return "violinColor";

    default:
      return "defaultColor";
  }
};
