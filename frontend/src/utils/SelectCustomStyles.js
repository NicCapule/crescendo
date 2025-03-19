export const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: state.isDisabled ? "#e0e0e0" : "white",
    border: state.isFocused ? "2px solid #114ed0" : "none",
    borderRadius: "12px",
    textAlign: "left",
    boxShadow: "0 5px 5px hsla(0, 0%, 1%, 0.282)",
  }),
  input: (base) => ({
    ...base,
    color: "#242424",
  }),
  singleValue: (base) => ({
    ...base,
    fontWeight: "bold",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "12px",
    overflow: "hidden",
    textAlign: "left",
  }),
  menuList: (base) => ({
    ...base,
    padding: "0px",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#114ed0" : "transparent",
    color: state.isSelected ? "white" : "#242424",
    "&:hover": {
      backgroundColor: "#709dff",
    },
  }),
};

export const customAttendanceStyles = {
  ...customStyles,
  control: (base, state) => ({
    ...base,
    backgroundColor: state.isDisabled ? "#e0e0e0" : "white",
    border: state.isFocused ? "2px solid #114ed0" : "none",
    borderRadius: "12px",
    textAlign: "left",
    boxShadow: state.isFocused
      ? "0 0 8px rgba(17, 78, 208, 0.6)"
      : "0 3px 3px rgba(0, 0, 0, 0.1)",
  }),
  singleValue: (base, state) => ({
    ...base,
    color: state.selectProps.value?.color || "#242424",
    fontWeight: "bold",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#e3e3e3"
      : state.isFocused
      ? "#e8f0fe"
      : "transparent",
    color: state.data.color,
    fontWeight: state.isSelected ? "bold" : "normal",
    "&:hover": {
      backgroundColor: "#709dff", // Blue on hover
      color: "white",
    },
  }),
};
