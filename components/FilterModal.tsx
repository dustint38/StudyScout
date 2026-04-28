import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { SpotFilters } from '@/types';
import { DEFAULT_FILTERS } from '@/hooks/useSpotSearch';

type Props = {
  visible: boolean;
  filters: SpotFilters;
  onChange: (filters: SpotFilters) => void;
  onClose: () => void;
};

const NOISE_LEVELS = ['Quiet', 'Moderate', 'Loud'] as const;

export default function FilterModal({ visible, filters, onChange, onClose }: Props) {
  const toggleNoiseLevel = (level: typeof NOISE_LEVELS[number]) => {
    const next = filters.noiseLevels.includes(level)
      ? filters.noiseLevels.filter(l => l !== level)
      : [...filters.noiseLevels, level];
    onChange({ ...filters, noiseLevels: next });
  };

  const cycleBool = (current: boolean | null): boolean | null =>
    current === null ? true : current === true ? false : null;

  const boolLabel = (val: boolean | null) =>
    val === null ? 'Any' : val ? 'Yes' : 'No';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Filter Spots</Text>
          <Pressable onPress={() => onChange(DEFAULT_FILTERS)}>
            <Text style={styles.reset}>Reset</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Noise Level</Text>
        <View style={styles.chipRow}>
          {NOISE_LEVELS.map(level => {
            const active = filters.noiseLevels.includes(level);
            return (
              <Pressable
                key={level}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => toggleNoiseLevel(level)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{level}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>WiFi</Text>
        <Pressable
          style={styles.toggleRow}
          onPress={() => onChange({ ...filters, hasWifi: cycleBool(filters.hasWifi) })}
        >
          <Text style={styles.toggleText}>Has WiFi</Text>
          <View style={[styles.badge, filters.hasWifi !== null && styles.badgeActive]}>
            <Text style={[styles.badgeText, filters.hasWifi !== null && styles.badgeTextActive]}>
              {boolLabel(filters.hasWifi)}
            </Text>
          </View>
        </Pressable>

        <Text style={styles.label}>Outlets</Text>
        <Pressable
          style={styles.toggleRow}
          onPress={() => onChange({ ...filters, hasOutlets: cycleBool(filters.hasOutlets) })}
        >
          <Text style={styles.toggleText}>Has Outlets</Text>
          <View style={[styles.badge, filters.hasOutlets !== null && styles.badgeActive]}>
            <Text style={[styles.badgeText, filters.hasOutlets !== null && styles.badgeTextActive]}>
              {boolLabel(filters.hasOutlets)}
            </Text>
          </View>
        </Pressable>

        <Pressable style={styles.doneButton} onPress={onClose}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:        { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet:           { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24, paddingBottom: 40 },
  headerRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  heading:         { fontSize: 18, fontWeight: '700' },
  reset:           { fontSize: 14, color: '#007AFF' },
  label:           { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8, marginTop: 16 },
  chipRow:         { flexDirection: 'row', gap: 8 },
  chip:            { borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  chipActive:      { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  chipText:        { fontSize: 14, color: '#333' },
  chipTextActive:  { color: '#fff' },
  toggleRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  toggleText:      { fontSize: 15 },
  badge:           { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  badgeActive:     { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  badgeText:       { fontSize: 13, color: '#666' },
  badgeTextActive: { color: '#fff' },
  doneButton:      { marginTop: 24, backgroundColor: '#007AFF', borderRadius: 10, padding: 14, alignItems: 'center' },
  doneText:        { color: '#fff', fontWeight: '700', fontSize: 15 },
});
