import { StyleSheet, Text, Pressable, View } from 'react-native';
import { telemetry, FeatureTag, Severity } from "@phantom-labs/telemetry";

telemetry.init();

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => telemetry.captureError(new Error("This is an Error"), FeatureTag.Account)}>
          <Text>Capture Error</Text>
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => telemetry.addBreadcrumb(FeatureTag.Account, "Testing Breadcrumb", Severity.Info)}>
          <Text>Capture Breadcrumb</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    marginBottom: 10,
  }
});
