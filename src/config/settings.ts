export type ConfigValueType = 'integer' | 'float' | 'select'

export const SECTIONS = {
  SYSTEM: 'system',
  ALERTS: 'alerts',
  UNASSIGNED: 'unassigned'
} as const

export type SectionType = typeof SECTIONS[keyof typeof SECTIONS]

export const UI_CONFIG = {
  SHOW_CONFIG_KEYS: false,
  ADVANCED_WARNING: 'Warning: Advanced settings affect core device functionality. Incorrect values may cause the device to malfunction.'
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

export const SYSTEM_CONFIG = {
  TARGET_ENERGY: {
    key: 'TARGET_ENERGY',
    label: 'Target Energy',
    description: 'Target energy level for the system',
    unit: 'J',
    section: SECTIONS.SYSTEM,
    advanced: true,
    validation: {
      type: 'float' as const,
      min: 0,
      max: 20000
    }
  },
  SOLENOID_PULSE_LEN_US: {
    key: 'SOLENOID_PULSE_LEN_US',
    label: 'Solenoid Pulse Length',
    description: 'Duration of the solenoid pulse',
    unit: 'µs',
    section: SECTIONS.SYSTEM,
    advanced: true,
    validation: {
      type: 'float' as const,
      min: 0,
      max: 20000
    }
  },
  INTERP_STEP_MM: {
    key: 'INTERP_STEP_MM',
    label: 'Interpolation Step',
    description: 'Step size for interpolation',
    unit: 'mm',
    section: SECTIONS.SYSTEM,
    advanced: true,
    validation: {
      type: 'float' as const,
      min: 0,
      max: 20000
    }
  },
  DISTANCE_ENCODER_STEP_MM: {
    key: 'DISTANCE_ENCODER_STEP_MM',
    label: 'Distance Encoder Step',
    description: 'Step size for distance encoder',
    unit: 'mm',
    section: SECTIONS.SYSTEM,
    advanced: true,
    validation: {
      type: 'float' as const,
      min: 0,
      max: 20000
    }
  },
  ACCELEROMETER_RANGE_PM: {
    key: 'ACCELEROMETER_RANGE_PM',
    label: 'Accelerometer Range',
    description: 'Range of the accelerometer',
    unit: '',
    section: SECTIONS.SYSTEM,
    advanced: true,
    validation: {
      type: 'float' as const,
      min: 0,
      max: 20000
    }
  },
  PID_MODE: {
    key: 'PID_MODE',
    label: 'Hammer speed control',
    description: 'Hammer speed control mode',
    unit: '',
    section: SECTIONS.SYSTEM,
    advanced: true,
    validation: {
      type: 'select' as const,
      options: [
        { label: 'Off', value: 0 },
        { label: 'Continuous', value: 1 }
      ]
    }
  }
} as const

export const ALERT_LIMITS = {
  MEAN_G: {
    key: 'mean_g',
    label: 'Mean',
    description: 'Mean acceleration limits',
    unit: 'g',
    section: SECTIONS.ALERTS,
    validation: {
      type: 'float' as const,
      min: 0,
      max: 20000
    }
  },
  STDEV_G: {
    key: 'stdev_g',
    label: 'Standard Deviation',
    description: 'Standard deviation of acceleration',
    unit: 'g',
    section: SECTIONS.ALERTS,
    validation: {
      type: 'float' as const,
      min: 0,
      max: 20000
    }
  },
  CV_PRCNT: {
    key: 'cv_prcnt',
    label: 'CV',
    description: 'Coefficient of variation percentage',
    unit: '%',
    section: SECTIONS.ALERTS,
    validation: {
      type: 'float' as const,
      min: 0,
      max: 100
    }
  },
  MIN_G: {
    key: 'min_g',
    label: 'Minimum',
    description: 'Minimum acceleration limits',
    unit: 'g',
    section: SECTIONS.ALERTS,
    validation: {
      type: 'float' as const,
      min: 0,
      max: 20000
    }
  },
  MAX_G: {
    key: 'max_g',
    label: 'Maximum',
    description: 'Maximum acceleration limits',
    unit: 'g',
    section: SECTIONS.ALERTS,
    validation: {
      type: 'float' as const,
      min: 0,
      max: 20000
    }
  },
  PP_G: {
    key: 'pp_g',
    label: 'Peak-to-Peak',
    description: 'Peak-to-peak acceleration limits',
    unit: 'g',
    section: SECTIONS.ALERTS,
    validation: {
      type: 'float' as const,
      min: 0,
      max: 20000
    }
  }
} as const