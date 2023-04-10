import { TouchableOpacity, StyleSheet, Text } from "react-native";
const PrimaryButton = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
      <Text style={styles.primaryButtonText}>{text}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#FF6C00",
    width: "100%",
    borderRadius: 100,
    paddingVertical: 16,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    fontFamily: "Roboto-Regular",
  },
});

export default PrimaryButton;
