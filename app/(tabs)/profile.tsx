import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { logOut } from "../../services/auth";
import { useAuth } from "../../hooks/useAuth";
import { Colors } from "../../constants/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];
  const s = makeStyles(colors);

  const handleSignOut = async () => {
    await logOut();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <Text style={s.heading}>Profile</Text>

        {user?.email && (
          <Text style={s.email}>{user.email}</Text>
        )}

        <TouchableOpacity style={s.signOutBtn} onPress={handleSignOut}>
          <Text style={s.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, padding: 24 },
    heading: { fontSize: 26, fontWeight: "700", color: colors.text, marginBottom: 8 },
    email: { fontSize: 14, color: colors.icon, marginBottom: 32 },
    signOutBtn: {
      borderWidth: 1,
      borderColor: "#c0392b",
      borderRadius: 8,
      padding: 13,
      alignItems: "center",
    },
    signOutText: { color: "#c0392b", fontWeight: "600", fontSize: 15 },
  });
