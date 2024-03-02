import { View, Text } from "react-native";

const Welcome = ({ name }: { name: string }) => {
  return (
    <View>
      <Text>Welcome to the app {name}!</Text>
    </View>
  );
};

export default Welcome;
