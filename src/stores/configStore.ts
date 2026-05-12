import { writable, derived } from 'svelte/store'
import type { ConfigItem, AlertLimitItem, ConfigSection } from '../types'
import { defaultConfigs, groupItemsBySection } from '../utils/configUtils'
import { UI_CONFIG } from '../config/settings'
import { DEFAULT_FIRMWARE_VERSION, isFirmwareVersion, type FirmwareVersion } from '../config/firmwareVersions'

const STORAGE_KEY = 'rqp-configurator-state'
const FIRMWARE_VERSION_STORAGE_KEY = 'rqp-configurator-firmware-version'

const loadFirmwareVersion = (): FirmwareVersion => {
  if (typeof window === 'undefined' || !UI_CONFIG.PERSIST_STATE) return DEFAULT_FIRMWARE_VERSION

  const savedVersion = window.localStorage.getItem(FIRMWARE_VERSION_STORAGE_KEY)
  return isFirmwareVersion(savedVersion)
    ? savedVersion
    : DEFAULT_FIRMWARE_VERSION
}

// Load initial state from localStorage or use default
const loadInitialState = () => {
  if (typeof window === 'undefined' || !UI_CONFIG.PERSIST_STATE) return defaultConfigs

  const savedState = window.localStorage.getItem(STORAGE_KEY)
  if (!savedState) return defaultConfigs

  try {
    const parsedState = JSON.parse(savedState)
    return parsedState
  } catch (error) {
    console.error('Error loading saved state:', error)
    return defaultConfigs
  }
}

function createConfigStore() {
  const { subscribe, set, update } = writable<ConfigSection[]>(loadInitialState())
  let currentFirmwareVersion: FirmwareVersion = loadFirmwareVersion()

  // Save to localStorage whenever the store changes
  subscribe(state => {
    if (typeof window !== 'undefined' && UI_CONFIG.PERSIST_STATE) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  })

  return {
    subscribe,
    clearAllValues: () => update((sections: ConfigSection[]) =>
      sections.map(section => {
        if (section.type === 'alert_limits') {
          return {
            ...section,
            items: section.items.map(item => ({ ...item as AlertLimitItem, minValue: '', maxValue: '' }))
          }
        }
        return {
          ...section,
          items: section.items.map(item => ({ ...item as ConfigItem, value: '' }))
        }
      })
    ),
    resetAdvancedValues: () => update((sections: ConfigSection[]) =>
      sections.map(section => {
        if (section.type === 'alert_limits') {
          return {
            ...section,
            items: (section.items as AlertLimitItem[]).map(item =>
              item.advanced ? { ...item, minValue: '', maxValue: '' } : item
            )
          }
        }
        return {
          ...section,
          items: (section.items as ConfigItem[]).map(item =>
            item.advanced ? { ...item, value: item.defaultValue ?? '' } : item
          )
        }
      }) as ConfigSection[]
    ),
    updateConfigValue: (sectionId: string, key: string, value: string) => update((sections: ConfigSection[]) =>
      sections.map(section => {
        if (section.id !== sectionId) return section
        if (section.type === 'alert_limits') return section

        return {
          ...section,
          items: (section.items as ConfigItem[]).map(item =>
            item.key === key && 'value' in item
              ? { ...item, value }
              : item
          )
        }
      })
    ),
    updateAlertLimitValues: (sectionId: string, key: string, minValue: string, maxValue: string) => update((sections: ConfigSection[]) =>
      sections.map(section => {
        if (section.id !== sectionId) return section
        if (section.type !== 'alert_limits') return section

        return {
          ...section,
          items: (section.items as AlertLimitItem[]).map(item =>
            item.key === key && 'minValue' in item
              ? { ...item, minValue, maxValue }
              : item
          )
        }
      })
    ),
    setFirmwareVersion: (version: FirmwareVersion) => update((sections: ConfigSection[]) => {
      currentFirmwareVersion = version
      const nextSections = groupItemsBySection(version)

      return nextSections.map(section => {
        const existingSection = sections.find((existing: ConfigSection) => existing.id === section.id)
        if (!existingSection) return section

        return {
          ...section,
          items: section.items.map(item => {
            const existingItem = existingSection.items.find((existing: ConfigItem | AlertLimitItem) =>
              'key' in item && 'key' in existing && item.key === existing.key
            )

            if (!existingItem) return item
            if ('value' in item && 'value' in existingItem) {
              return { ...item, value: existingItem.value }
            }
            if ('minValue' in item && 'minValue' in existingItem) {
              return {
                ...item,
                minValue: existingItem.minValue,
                maxValue: existingItem.maxValue
              }
            }
            return item
          })
        }
      }) as ConfigSection[]
    }),
    resetToDefault: () => {
      if (typeof window !== 'undefined' && UI_CONFIG.PERSIST_STATE) {
        window.localStorage.removeItem(STORAGE_KEY)
      }
      set(groupItemsBySection(currentFirmwareVersion))
    }
  }
}

export const configStore = createConfigStore()

export const selectedFirmwareVersionStore = writable<FirmwareVersion>(loadFirmwareVersion())

selectedFirmwareVersionStore.subscribe(version => {
  if (typeof window !== 'undefined' && UI_CONFIG.PERSIST_STATE) {
    window.localStorage.setItem(FIRMWARE_VERSION_STORAGE_KEY, version)
  }
})

// Create a store for the showAdvanced state with localStorage persistence
const loadShowAdvanced = () => {
  if (typeof window === 'undefined' || !UI_CONFIG.PERSIST_STATE) return false
  return window.localStorage.getItem('showAdvanced') === 'true'
}

export const showAdvancedStore = writable(loadShowAdvanced())

// Save showAdvanced state to localStorage
showAdvancedStore.subscribe(value => {
  if (typeof window !== 'undefined' && UI_CONFIG.PERSIST_STATE) {
    window.localStorage.setItem('showAdvanced', value.toString())
  }
})

// Create a derived store that depends on both configStore and showAdvancedStore
export const visibleSections = derived(
  [configStore, showAdvancedStore],
  ([$configStore, $showAdvanced]) => {
    return $configStore.filter(section =>
      $showAdvanced || section.items.some(item => !item.advanced)
    )
  }
)
