export type ConfigValueType = 'integer' | 'float' | 'select' | 'toggle'

interface BaseConfigItem {
  key: string;
  label: string;
  description: string;
  unit: string;
  validation: ConfigValidation | SelectValidation | ToggleValidation;
  advanced?: boolean;
}

interface ConfigValidation {
  type: 'integer' | 'float';
  min?: number;
  max?: number;
}

interface SelectValidation {
  type: 'select';
  options: { label: string; value: number | string }[];
}

interface ToggleValidation {
  type: 'toggle';
  offLabel?: string;
  onLabel?: string;
}

interface SectionConfig {
  id: string;
  title: string;
  type?: 'alert_limits';
  defaultExpanded?: boolean;
  items: Record<string, BaseConfigItem>;
}

export const SECTIONS: Record<string, SectionConfig> = {
  BASIC: {
    id: 'basic',
    title: 'Basic Settings',
    items: {
      LOCALE: {
        key: 'locale',
        label: 'Language',
        description: 'Interface language',
        unit: '',
        validation: {
          type: 'select' as const,
          options: [
            { label: 'English', value: 'en' },
            { label: 'Suomi', value: 'fi' },
            { label: '日本語', value: 'ja' },
            { label: '简体中文', value: 'zh-cn' }
          ]
        }
      },
      ROTATION: {
        key: 'rotation',
        label: 'Screen Rotation',
        description: 'Set the display orientation',
        unit: '',
        validation: {
          type: 'select' as const,
          options: [
            { label: 'Normal', value: 1 },
            { label: 'Flipped', value: 3 }
          ]
        }
      },
      IDLE_SHUTDOWN_TIMEOUT: {
        key: 'idle_shutdown_timeout',
        label: 'Auto Shutdown',
        description: 'Time in minutes before automatic shutdown when idle',
        unit: 'min',
        validation: {
          type: 'integer' as const,
          min: 0,
          max: 1440
        }
      },
      REMOVE_FILES_AFTER_SYNC: {
        key: 'remove_files_after_sync',
        label: 'Auto Clean Files',
        description: 'Automatically remove measurement files after successful sync',
        unit: '',
        validation: {
          type: 'toggle' as const,
          offLabel: 'Keep',
          onLabel: 'Remove'
        }
      }
    }
  },
  ALERTS: {
    id: 'alerts',
    title: 'Alert Limits',
    type: 'alert_limits' as const,
    items: {
      MEAN_G: {
        key: 'mean_g',
        label: 'Mean',
        description: 'Mean acceleration limits',
        unit: 'g',
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
        validation: {
          type: 'float' as const,
          min: 0,
          max: 20000
        }
      }
    }
  },
  SYSTEM: {
    id: 'system',
    title: 'System Configuration',
    items: {
      TARGET_ENERGY: {
        key: 'TARGET_ENERGY',
        label: 'Target Energy',
        description: 'Target energy level for the system',
        unit: 'J',
        advanced: true,
        validation: {
          type: 'float' as const,
          min: 0,
          max: 50000
        }
      },
      SOLENOID_PULSE_LEN_US: {
        key: 'SOLENOID_PULSE_LEN_US',
        label: 'Solenoid Pulse Length',
        description: 'Duration of the solenoid pulse',
        unit: 'µs',
        advanced: true,
        validation: {
          type: 'float' as const,
          min: 0,
          max: 15000
        }
      },
      ADJUSTMENT_A: {
        key: 'ADJUSTMENT_A',
        label: 'Adjustment A',
        description: 'Quadratic adjustment of measurement values',
        unit: '',
        advanced: true,
        validation: {
          type: 'float' as const,
          min: -1000,
          max: 1000
        }
      },
      ADJUSTMENT_B: {
        key: 'ADJUSTMENT_B',
        label: 'Adjustment B',
        description: 'Linear adjustment of measurement values',
        unit: '',
        advanced: true,
        validation: {
          type: 'float' as const,
          min: -1000,
          max: 1000
        }
      },
      ADJUSTMENT_C: {
        key: 'ADJUSTMENT_C',
        label: 'Adjustment C',
        description: 'Constant adjustment of measurement values',
        unit: '',
        advanced: true,
        validation: {
          type: 'float' as const,
          min: -1000,
          max: 1000
        }
      },
      INTERP_STEP_MM: {
        key: 'INTERP_STEP_MM',
        label: 'Interpolation Step',
        description: 'Step size for interpolation',
        unit: 'mm',
        advanced: true,
        validation: {
          type: 'float' as const,
          min: 0,
          max: 10
        }
      },
      DISTANCE_ENCODER_STEP_MM: {
        key: 'DISTANCE_ENCODER_STEP_MM',
        label: 'Distance Encoder Step',
        description: 'Step size for distance encoder',
        unit: 'mm',
        advanced: true,
        validation: {
          type: 'float' as const,
          min: 0,
          max: 10
        }
      },
      ACCELEROMETER_RANGE_PM: {
        key: 'ACCELEROMETER_RANGE_PM',
        label: 'Accelerometer Range',
        description: 'Range of the accelerometer',
        unit: '',
        advanced: true,
        validation: {
          type: 'float' as const,
          min: -1000,
          max: 1000
        }
      },
      PID_MODE: {
        key: 'PID_MODE',
        label: 'Hammer speed control',
        description: 'Hammer speed control mode',
        unit: '',
        advanced: true,
        validation: {
          type: 'select' as const,
          options: [
            { label: 'Off', value: 0 },
            { label: 'Continuous', value: 1 }
          ]
        }
      }
    }
  }
} as const

export type SectionType = keyof typeof SECTIONS

export const UI_CONFIG = {
  SHOW_CONFIG_KEYS: false,
  ADVANCED_WARNING: 'Warning: Advanced settings affect core device functionality. Incorrect values may cause the device to malfunction.',
  TIME_SYNC_UPDATE_INTERVAL: 1000 // Update timestamp every second
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