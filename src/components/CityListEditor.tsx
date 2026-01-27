import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Modal,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { spacing, fontSize, fonts, borderRadius } from '../constants';
// Note: City and CreateCityInput types available from '../types' if needed
import { DialogHeader } from './DialogHeader';
import { useI18n, useTheme } from '../hooks';

type CityDraft = {
  id?: string;
  name: string;
  arrivalDate?: string;
  departureDate?: string;
};

type CityListEditorProps = {
  cities: CityDraft[];
  onCitiesChange: (cities: CityDraft[]) => void;
  tripStartDate?: string;
  tripEndDate?: string;
  onTripStartDateChange?: (date: string) => void;
  onTripEndDateChange?: (date: string) => void;
};

type DatePickerTarget = 'arrival' | 'departure' | null;

export function CityListEditor({
  cities,
  onCitiesChange,
  tripStartDate,
  tripEndDate,
  onTripStartDateChange,
  onTripEndDateChange,
}: CityListEditorProps) {
  const { t, locale } = useI18n();
  const colors = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftCity, setDraftCity] = useState<CityDraft>({ name: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<DatePickerTarget>(null);

  const openAddModal = () => {
    Keyboard.dismiss();
    setEditingIndex(null);
    setDraftCity({
      name: '',
      arrivalDate: tripStartDate,
      departureDate: tripEndDate,
    });
    setShowModal(true);
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setDraftCity({ ...cities[index] });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDatePicker(false);
    setDatePickerTarget(null);
    setDraftCity({ name: '' });
    setEditingIndex(null);
  };

  const saveCity = () => {
    if (!draftCity.name.trim()) return;

    const newCities = [...cities];
    if (editingIndex !== null) {
      newCities[editingIndex] = draftCity;
    } else {
      newCities.push(draftCity);
    }
    onCitiesChange(newCities);
    closeModal();
  };

  const removeCity = (index: number) => {
    const newCities = cities.filter((_, i) => i !== index);
    onCitiesChange(newCities);
  };

  const moveCity = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= cities.length) return;

    const newCities = [...cities];
    [newCities[index], newCities[newIndex]] = [newCities[newIndex], newCities[index]];
    onCitiesChange(newCities);
  };

  const openDatePicker = (target: DatePickerTarget) => {
    Keyboard.dismiss();
    setDatePickerTarget(target);
    setShowDatePicker(true);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'set' && selectedDate && datePickerTarget) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      setDraftCity({
        ...draftCity,
        [datePickerTarget === 'arrival' ? 'arrivalDate' : 'departureDate']: dateStr,
      });

      // Auto-update trip dates if city date is outside current trip range
      if (datePickerTarget === 'arrival' && onTripStartDateChange) {
        if (!tripStartDate || dateStr < tripStartDate) {
          onTripStartDateChange(dateStr);
        }
      }
      if (datePickerTarget === 'departure' && onTripEndDateChange) {
        if (!tripEndDate || dateStr > tripEndDate) {
          onTripEndDateChange(dateStr);
        }
      }
    }
  };

  const confirmIOSDate = () => {
    setShowDatePicker(false);
    setDatePickerTarget(null);
  };

  const clearDate = (field: 'arrivalDate' | 'departureDate') => {
    setDraftCity({ ...draftCity, [field]: undefined });
  };

  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return t('dialogs.cityEditor.notSet');
    return new Date(dateStr).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPickerDate = () => {
    if (datePickerTarget === 'arrival' && draftCity.arrivalDate) {
      return new Date(draftCity.arrivalDate);
    }
    if (datePickerTarget === 'departure' && draftCity.departureDate) {
      return new Date(draftCity.departureDate);
    }
    return new Date();
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{t('dialogs.cityEditor.label')}</Text>

      {cities.length === 0 ? (
        <View style={[styles.emptyState, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
          <Ionicons name="location-outline" size={32} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t('dialogs.cityEditor.empty')}</Text>
        </View>
      ) : (
        <View style={styles.cityList}>
          {cities.map((city, index) => (
            <View key={city.id || index} style={[styles.cityItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cityInfo}>
                <Text style={[styles.cityName, { color: colors.text }]}>{city.name}</Text>
                {(city.arrivalDate || city.departureDate) && (
                  <Text style={[styles.cityDates, { color: colors.textMuted }]}>
                    {city.arrivalDate && city.departureDate
                      ? `${formatDateDisplay(city.arrivalDate)} - ${formatDateDisplay(city.departureDate)}`
                      : city.arrivalDate
                      ? t('dialogs.cityEditor.fromDate', {
                        date: formatDateDisplay(city.arrivalDate),
                      })
                      : t('dialogs.cityEditor.untilDate', {
                        date: formatDateDisplay(city.departureDate),
                      })}
                  </Text>
                )}
              </View>
              <View style={styles.cityActions}>
                {index > 0 && (
                  <Pressable onPress={() => moveCity(index, 'up')} hitSlop={8}>
                    <Ionicons name="chevron-up" size={20} color={colors.textMuted} />
                  </Pressable>
                )}
                {index < cities.length - 1 && (
                  <Pressable onPress={() => moveCity(index, 'down')} hitSlop={8}>
                    <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
                  </Pressable>
                )}
                <Pressable onPress={() => openEditModal(index)} hitSlop={8}>
                  <Ionicons name="pencil" size={18} color={colors.textMuted} />
                </Pressable>
                <Pressable onPress={() => removeCity(index)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}

      <Pressable style={[styles.addButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.primary }]} onPress={openAddModal}>
        <Ionicons name="add" size={20} color={colors.primary} />
        <Text style={[styles.addButtonText, { color: colors.primary }]}>{t('dialogs.cityEditor.addCity')}</Text>
      </Pressable>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={[styles.fullScreenModal, { backgroundColor: colors.background }]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <DialogHeader
              title={
                editingIndex !== null
                  ? t('dialogs.cityEditor.editTitle')
                  : t('dialogs.cityEditor.addTitle')
              }
              onClose={closeModal}
              actionLabel={editingIndex !== null ? t('common.save') : t('common.add')}
              onAction={saveCity}
              actionDisabled={!draftCity.name.trim()}
            />
          </View>

          <ScrollView
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formField}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t('dialogs.cityEditor.cityNameLabel')}</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text }]}
                value={draftCity.name}
                onChangeText={(text) => setDraftCity({ ...draftCity, name: text })}
                placeholder={t('dialogs.cityEditor.cityNamePlaceholder')}
                placeholderTextColor={colors.textMuted}
                autoFocus
              />
            </View>

            <View style={styles.formField}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t('dialogs.cityEditor.arrivalDateLabel')}</Text>
              <View style={styles.dateRow}>
                <Pressable
                  style={[styles.dateButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
                  onPress={() => openDatePicker('arrival')}
                >
                  <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                  <Text style={[styles.dateText, { color: colors.text }]}>
                    {formatDateDisplay(draftCity.arrivalDate)}
                  </Text>
                </Pressable>
                {draftCity.arrivalDate && (
                  <Pressable onPress={() => clearDate('arrivalDate')} hitSlop={8}>
                    <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                  </Pressable>
                )}
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t('dialogs.cityEditor.departureDateLabel')}</Text>
              <View style={styles.dateRow}>
                <Pressable
                  style={[styles.dateButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
                  onPress={() => openDatePicker('departure')}
                >
                  <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                  <Text style={[styles.dateText, { color: colors.text }]}>
                    {formatDateDisplay(draftCity.departureDate)}
                  </Text>
                </Pressable>
                {draftCity.departureDate && (
                  <Pressable onPress={() => clearDate('departureDate')} hitSlop={8}>
                    <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                  </Pressable>
                )}
              </View>
            </View>

            {showDatePicker && (
              <View style={[styles.datePickerContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.datePickerLabel, { color: colors.textSecondary }]}>
                  {datePickerTarget === 'arrival'
                    ? t('dialogs.cityEditor.arrivalDateLabel')
                    : t('dialogs.cityEditor.departureDateLabel')}
                </Text>
                <DateTimePicker
                  value={getPickerDate()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  locale={locale}
                  themeVariant={colors.isDark ? 'dark' : 'light'}
                  style={styles.datePicker}
                />
                {Platform.OS === 'ios' && (
                  <Pressable style={[styles.datePickerDone, { borderTopColor: colors.border }]} onPress={confirmIOSDate}>
                    <Text style={[styles.datePickerDoneText, { color: colors.primary }]}>{t('dialogs.cityEditor.done')}</Text>
                  </Pressable>
                )}
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.md,
    fontFamily: fonts.ui,
    marginBottom: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body,
    marginTop: spacing.sm,
  },
  cityList: {
    gap: spacing.sm,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: fontSize.md,
    fontFamily: fonts.ui,
  },
  cityDates: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body,
    marginTop: spacing.xs,
  },
  cityActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: fontSize.md,
    fontFamily: fonts.ui,
  },
  fullScreenModal: {
    flex: 1,
  },
  modalHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  formField: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: fontSize.sm,
    fontFamily: fonts.ui,
    marginBottom: spacing.xs,
  },
  textInput: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    fontFamily: fonts.body,
    borderWidth: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
  },
  dateText: {
    fontSize: fontSize.md,
    fontFamily: fonts.body,
  },
  datePickerContainer: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  datePickerLabel: {
    fontSize: fontSize.sm,
    fontFamily: fonts.ui,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  datePicker: {
    height: 200,
  },
  datePickerDone: {
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 1,
  },
  datePickerDoneText: {
    fontSize: fontSize.md,
    fontFamily: fonts.ui,
  },
});
