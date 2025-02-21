import { derived } from 'svelte/store'
import type { ConfigItem, AlertLimitItem } from '../types'
import { configStore } from './configStore'
import { QR_CONFIG, UI_CONFIG } from '../config/settings'
import { getCurrentTimestamp } from '../utils/timeUtils'
import { onDestroy } from 'svelte'

// Create a store that updates every second for time sync
let interval: NodeJS.Timeout
let cleanup = () => {
  if (interval) clearInterval(interval)
}

export const qrText = derived<typeof configStore, { text: string; showWarning: boolean }>(
  configStore,
  ($configStore, set) => {
    const updateQRText = () => {
      const configPairs = $configStore
        .flatMap(section => section.items as (ConfigItem | AlertLimitItem)[])
        .flatMap((item: ConfigItem | AlertLimitItem) => {
          if ('value' in item) {
            if (item.key === 'SETTIME') {
              const dateTimeSection = $configStore.find(s => s.id === 'date_time')
              const timezoneItem = dateTimeSection?.items.find(i => 'key' in i && i.key === 'timezone')
              const timezone = timezoneItem && 'value' in timezoneItem ? timezoneItem.value : 'local'
              return item.value === '1' ? [`${item.key}=${getCurrentTimestamp(timezone)}`] : []
            }
            if (item.key === 'timezone') {
              return []
            }
            // Skip empty values and tristate toggle's empty state
            if (!item.value.trim() || (item.validation.type === 'toggle' && item.validation.tristate && !item.value)) {
              return []
            }
            return [`${item.key}=${item.value}`]
          }
          const minKey = `${item.key}_min`
          const maxKey = `${item.key}_max`
          return [
            ...(item.minValue.trim() ? [`${minKey}=${item.minValue}`] : []),
            ...(item.maxValue.trim() ? [`${maxKey}=${item.maxValue}`] : [])
          ]
        })

      const validConfigs = configPairs.slice(0, QR_CONFIG.MAX_CONFIG_VALUES).join(';')
      set({
        text: validConfigs,
        showWarning: configPairs.length > QR_CONFIG.MAX_CONFIG_VALUES
      })
    }

    // Initial update
    updateQRText()

    // Check if time sync is enabled
    const dateTimeSection = $configStore.find(s => s.id === 'date_time')
    const timeSyncItem = dateTimeSection?.items.find(item => item.key === 'SETTIME')

    if (timeSyncItem && 'value' in timeSyncItem && timeSyncItem.value === '1') {
      // Clear any existing interval
      cleanup()
      // Set up new interval
      interval = setInterval(updateQRText, UI_CONFIG.TIME_SYNC_UPDATE_INTERVAL)
    } else {
      cleanup()
    }

    return cleanup
  },
  { text: '', showWarning: false }
)