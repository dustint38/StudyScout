import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { signIn, getAuthErrorMessage } from "../../services/auth";
import { Colors } from "../../constants/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];
  const s = makeStyles(colors);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={s.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.header}>
            <Text style={s.appName}>StudyScout</Text>
            <Text style={s.subtitle}>Log in to your account</Text>
          </View>

          {error && <Text style={s.error}>{error}</Text>}

          <Text style={s.label}>Email</Text>
          <TextInput
            style={s.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.icon}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />

          <Text style={s.label}>Password</Text>
          <View style={s.passwordWrap}>
            <TextInput
              style={s.passwordInput}
              placeholder="Password"
              placeholderTextColor={colors.icon}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              style={s.eyeBtn}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.icon}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[s.button, loading && s.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/signup")}
            style={s.switchRow}
          >
            <Text style={s.switchText}>Don't have an account? </Text>
            <Text style={[s.switchText, s.switchLink]}>Sign up</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    kav: { flex: 1 },
    scroll: { flexGrow: 1, justifyContent: "center", padding: 28 },

    header: { marginBottom: 36 },
    appName: { fontSize: 30, fontWeight: "700", color: colors.text, marginBottom: 6 },
    subtitle: { fontSize: 15, color: colors.icon },

    error: { color: "#c0392b", fontSize: 13, marginBottom: 16 },

    label: { fontSize: 13, fontWeight: "600", color: colors.text, marginBottom: 6 },
    input: {
      borderWidth: 1,
      borderColor: colors.icon + "55",
      borderRadius: 8,
      padding: 12,
      fontSize: 15,
      color: colors.text,
      marginBottom: 18,
    },
    passwordWrap: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.icon + "55",
      borderRadius: 8,
      marginBottom: 24,
    },
    passwordInput: { flex: 1, padding: 12, fontSize: 15, color: colors.text },
    eyeBtn: { padding: 12 },

    button: {
      backgroundColor: "#0a7ea4",
      borderRadius: 8,
      padding: 14,
      alignItems: "center",
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },

    switchRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
    switchText: { color: colors.icon, fontSize: 14 },
    switchLink: { color: "#0a7ea4", fontWeight: "600" },
  });
