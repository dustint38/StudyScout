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
import { signUp, getAuthErrorMessage } from "../../services/auth";
import { Colors } from "../../constants/theme";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];
  const s = makeStyles(colors);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signUp(email.trim(), password, name.trim());
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
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>

          <View style={s.header}>
            <Text style={s.appName}>Create account</Text>
            <Text style={s.subtitle}>Sign up to get started</Text>
          </View>

          {error && <Text style={s.error}>{error}</Text>}

          <Text style={s.label}>Full Name</Text>
          <TextInput
            style={s.input}
            placeholder="Your name"
            placeholderTextColor={colors.icon}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
          />

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
              placeholder="At least 6 characters"
              placeholderTextColor={colors.icon}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              returnKeyType="next"
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

          <Text style={s.label}>Confirm Password</Text>
          <View style={s.passwordWrap}>
            <TextInput
              style={s.passwordInput}
              placeholder="Repeat your password"
              placeholderTextColor={colors.icon}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              returnKeyType="done"
              onSubmitEditing={handleSignup}
            />
            <TouchableOpacity
              onPress={() => setShowConfirm((v) => !v)}
              style={s.eyeBtn}
            >
              <Ionicons
                name={showConfirm ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.icon}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[s.button, loading && s.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            style={s.switchRow}
          >
            <Text style={s.switchText}>Already have an account? </Text>
            <Text style={[s.switchText, s.switchLink]}>Log in</Text>
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

    backBtn: { marginBottom: 24, alignSelf: "flex-start" },

    header: { marginBottom: 32 },
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
      marginBottom: 18,
    },
    passwordInput: { flex: 1, padding: 12, fontSize: 15, color: colors.text },
    eyeBtn: { padding: 12 },

    button: {
      backgroundColor: "#0a7ea4",
      borderRadius: 8,
      padding: 14,
      alignItems: "center",
      marginTop: 4,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },

    switchRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
    switchText: { color: colors.icon, fontSize: 14 },
    switchLink: { color: "#0a7ea4", fontWeight: "600" },
  });
