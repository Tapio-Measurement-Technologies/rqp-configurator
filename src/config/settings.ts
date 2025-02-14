export const UI_CONFIG = {
  SHOW_CONFIG_KEYS: false,
  ADVANCED_WARNING: 'Warning: Advanced settings affect core device functionality. Incorrect values may cause the device to malfunction.',
  TIME_SYNC_UPDATE_INTERVAL: 1000, // Update timestamp every second
  PERSIST_STATE: false // Whether to save state to localStorage
} as const

export const QR_CONFIG = {
  MAX_CONFIG_VALUES: 16,
  SOH_CHARACTER: '\x01',
  CONFIG_PREFIX: 'CFG:',
  QR_OPTIONS: {
    width: 300,
    margin: 2
  }
} as const