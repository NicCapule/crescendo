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
