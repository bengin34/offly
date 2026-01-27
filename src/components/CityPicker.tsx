import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fonts, borderRadius } from '../constants';
import type { City } from '../types';
import { DialogHeader } from './DialogHeader';
import { CityRepository } from '../db/repositories/CityRepository';
import { useI18n } from '../hooks';

type CityPickerProps = {
  cities: City[];
  selectedCityId?: string;
  onSelect: (cityId: string | undefined) => void;
  label?: string;
  placeholder?: string;
  tripId?: string;
  onCitiesChange?: (cities: City[]) => void;
};

export function CityPicker({
  cities,
  selectedCityId,
  onSelect,
  label,
  placeholder,
  tripId,
  onCitiesChange,
}: CityPickerProps) {
  const { t, locale } = useI18n();
  const [showPicker, setShowPicker] = useState(false);
  const [isAddingCity, setIsAddingCity] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [isCreatingCity, setIsCreatingCity] = useState(false);

  const selectedCity = cities.find((c) => c.id === selectedCityId);
  const canAddCity = Boolean(tripId && onCitiesChange);
  const resolvedLabel = label ?? t('dialogs.cityPicker.label');
  const resolvedPlaceholder = placeholder ?? t('dialogs.cityPicker.placeholder');

  const formatDateRange = (city: City) => {
    if (!city.arrivalDate && !city.departureDate) return null;
    const arrival = city.arrivalDate
      ? new Date(city.arrivalDate).toLocaleDateString(locale, { month: 'short', day: 'numeric' })
      : '?';
    const departure = city.departureDate
      ? new Date(city.departureDate).toLocaleDateString(locale, { month: 'short', day: 'numeric' })
      : '?';
    if (city.arrivalDate && city.departureDate) return `${arrival} - ${departure}`;
    if (city.arrivalDate) return t('dialogs.cityPicker.fromDate', { date: arrival });
    return t('dialogs.cityPicker.untilDate', { date: departure });
  };

  const closePicker = () => {
    setShowPicker(false);
    setIsAddingCity(false);
    setNewCityName('');
    setIsCreatingCity(false);
  };

  const handleSelect = (cityId: string | undefined) => {
    onSelect(cityId);
    closePicker();
  };

  const startAddCity = () => {
    if (!canAddCity) return;
    setNewCityName('');
    setIsAddingCity(true);
  };

  const cancelAddCity = () => {
    setIsAddingCity(false);
    setNewCityName('');
  };

  const createCity = async () => {
    if (!tripId || !onCitiesChange || !newCityName.trim()) return;
    setIsCreatingCity(true);
    try {
      const newCity = await CityRepository.create({
        tripId,
        name: newCityName.trim(),
      });
      const updatedCities = [...cities, newCity];
      onCitiesChange(updatedCities);
      setIsAddingCity(false);
      setNewCityName('');
      handleSelect(newCity.id);
    } catch (error) {
      console.error('Failed to create city:', error);
      Alert.alert(t('alerts.errorTitle'), t('alerts.createCityFailed'));
    } finally {
      setIsCreatingCity(false);
    }
  };

  const handleCreateCity = async () => {
    if (!newCityName.trim() || isCreatingCity) return;
    Keyboard.dismiss();
    await createCity();
  };

  if (cities.length === 0 && !canAddCity) {
    return null;
  }

  return (
    <View style={styles.container}>
      {resolvedLabel && <Text style={styles.label}>{resolvedLabel}</Text>}

      <Pressable style={styles.pickerButton} onPress={() => setShowPicker(true)}>
        <View style={styles.selectedValue}>
          <Ionicons
            name="location"
            size={18}
            color={selectedCity ? colors.primary : colors.textMuted}
          />
          <Text style={[styles.selectedText, !selectedCity && styles.placeholderText]}>
            {selectedCity ? selectedCity.name : resolvedPlaceholder}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
      </Pressable>

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={closePicker}
      >
        <Pressable style={styles.modalOverlay} onPress={closePicker}>
          <View style={styles.modalContent}>
            <DialogHeader
              title={t('dialogs.cityPicker.title')}
              onClose={closePicker}
              containerStyle={styles.modalHeader}
              showDivider
            />

            <FlatList
              data={cities}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedCityId;
                const dateRange = formatDateRange(item);

                return (
                  <Pressable
                    style={[styles.cityOption, isSelected && styles.cityOptionSelected]}
                    onPress={() => handleSelect(item.id)}
                  >
                    <View style={styles.cityOptionInfo}>
                      <Text style={[styles.cityOptionName, isSelected && styles.cityOptionNameSelected]}>
                        {item.name}
                      </Text>
                      {dateRange && (
                        <Text style={styles.cityOptionDates}>{dateRange}</Text>
                      )}
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    )}
                  </Pressable>
                );
              }}
              ListHeaderComponent={
                <View>
                  {canAddCity && !isAddingCity && (
                    <Pressable style={styles.addCityRow} onPress={startAddCity}>
                      <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
                      <Text style={styles.addCityRowText}>{t('dialogs.cityPicker.addCity')}</Text>
                    </Pressable>
                  )}
                  {canAddCity && isAddingCity && (
                    <View style={styles.addCityForm}>
                      <TextInput
                        style={styles.addCityInput}
                        value={newCityName}
                        onChangeText={setNewCityName}
                        placeholder={t('dialogs.cityPicker.cityNamePlaceholder')}
                        placeholderTextColor={colors.textMuted}
                        autoFocus
                        returnKeyType="done"
                        onSubmitEditing={handleCreateCity}
                      />
                      <View style={styles.addCityActions}>
                        <Pressable onPress={cancelAddCity} style={styles.addCityAction}>
                          <Text style={styles.addCityActionText}>{t('common.cancel')}</Text>
                        </Pressable>
                        <Pressable
                          onPress={handleCreateCity}
                          style={[
                            styles.addCityAction,
                            styles.addCityActionPrimary,
                            (!newCityName.trim() || isCreatingCity) && styles.addCityActionDisabled,
                          ]}
                          disabled={!newCityName.trim() || isCreatingCity}
                        >
                          {isCreatingCity ? (
                            <ActivityIndicator size="small" color={colors.white} />
                          ) : (
                            <Text style={styles.addCityActionTextPrimary}>{t('common.add')}</Text>
                          )}
                        </Pressable>
                      </View>
                    </View>
                  )}
                  {selectedCityId ? (
                    <Pressable
                      style={styles.clearOption}
                      onPress={() => handleSelect(undefined)}
                    >
                      <Ionicons name="close-circle-outline" size={18} color={colors.textMuted} />
                      <Text style={styles.clearOptionText}>{t('dialogs.cityPicker.noCity')}</Text>
                    </Pressable>
                  ) : null}
                </View>
              }
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              style={styles.cityList}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontFamily: fonts.ui,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  selectedText: {
    fontSize: fontSize.md,
    fontFamily: fonts.body,
    color: colors.text,
  },
  placeholderText: {
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: spacing.lg,
  },
  cityList: {
    maxHeight: 400,
  },
  cityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  cityOptionSelected: {
    backgroundColor: colors.accentSoft,
  },
  cityOptionInfo: {
    flex: 1,
  },
  cityOptionName: {
    fontSize: fontSize.md,
    fontFamily: fonts.ui,
    color: colors.text,
  },
  cityOptionNameSelected: {
    color: colors.primary,
  },
  cityOptionDates: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.lg,
  },
  clearOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  clearOptionText: {
    fontSize: fontSize.md,
    fontFamily: fonts.body,
    color: colors.textMuted,
  },
  addCityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addCityRowText: {
    fontSize: fontSize.md,
    fontFamily: fonts.ui,
    color: colors.primary,
  },
  addCityForm: {
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  addCityInput: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.md,
    fontFamily: fonts.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addCityActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  addCityAction: {
    minHeight: 40,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCityActionText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.ui,
    color: colors.textSecondary,
  },
  addCityActionPrimary: {
    backgroundColor: colors.primary,
  },
  addCityActionTextPrimary: {
    fontSize: fontSize.sm,
    fontFamily: fonts.ui,
    color: colors.white,
  },
  addCityActionDisabled: {
    opacity: 0.6,
  },
});
