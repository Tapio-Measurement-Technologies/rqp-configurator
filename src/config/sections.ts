import type { SectionConfig } from '../types'

export const SECTIONS: Record<string, SectionConfig> = {
  DATE_TIME: {
    id: 'date_time',
    title: 'Date and Time',
    defaultExpanded: true,
    items: {
      TIME_SYNC: {
        key: 'SETTIME',
        label: 'Time Synchronization',
        description: 'Synchronize device time with local time',
        unit: '',
        defaultValue: '1',
        validation: {
          type: 'toggle' as const,
          offLabel: 'Off',
          onLabel: 'On'
        }
      },
      TIMEZONE: {
        key: 'timezone',
        label: 'Timezone',
        description: 'Select timezone for time synchronization',
        unit: '',
        defaultValue: 'local',
        validation: {
          type: 'select' as const,
          options: [
            { label: 'Local Time', value: 'local' },
            { label: 'UTC (London, Lisbon)', value: 'UTC' },
            { label: 'UTC+1 (Berlin, Paris, Rome)', value: 'UTC+1' },
            { label: 'UTC+2 (Helsinki, Cairo, Jerusalem)', value: 'UTC+2' },
            { label: 'UTC+3 (Moscow, Istanbul, Riyadh)', value: 'UTC+3' },
            { label: 'UTC+4 (Dubai, Baku)', value: 'UTC+4' },
            { label: 'UTC+5 (Karachi, Tashkent)', value: 'UTC+5' },
            { label: 'UTC+6 (Dhaka, Almaty)', value: 'UTC+6' },
            { label: 'UTC+7 (Bangkok, Jakarta)', value: 'UTC+7' },
            { label: 'UTC+8 (Singapore, Beijing, Manila)', value: 'UTC+8' },
            { label: 'UTC+9 (Tokyo, Seoul)', value: 'UTC+9' },
            { label: 'UTC+10 (Sydney, Brisbane)', value: 'UTC+10' },
            { label: 'UTC+11 (Solomon Islands)', value: 'UTC+11' },
            { label: 'UTC+12 (Auckland, Fiji)', value: 'UTC+12' },
            { label: 'UTC-1 (Azores)', value: 'UTC-1' },
            { label: 'UTC-2 (South Georgia)', value: 'UTC-2' },
            { label: 'UTC-3 (São Paulo, Buenos Aires)', value: 'UTC-3' },
            { label: 'UTC-4 (New York, Toronto)', value: 'UTC-4' },
            { label: 'UTC-5 (Chicago, Mexico City)', value: 'UTC-5' },
            { label: 'UTC-6 (Denver, Calgary)', value: 'UTC-6' },
            { label: 'UTC-7 (Los Angeles, Phoenix)', value: 'UTC-7' },
            { label: 'UTC-8 (Anchorage)', value: 'UTC-8' },
            { label: 'UTC-9 (Alaska)', value: 'UTC-9' },
            { label: 'UTC-10 (Hawaii)', value: 'UTC-10' },
            { label: 'UTC-11 (Midway Islands)', value: 'UTC-11' },
            { label: 'UTC-12 (Baker Island)', value: 'UTC-12' }
          ]
        }
      }
    }
  },
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
          min: 1,
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
          onLabel: 'Remove',
          tristate: true
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
      PERSISTENT_PULSE_LEN_ENABLED: {
        key: 'PERSISTENT_PULSE_LEN_ENABLED',
        label: 'Enable Persistent Pulse Length',
        description: 'Adjusts pulse length automatically based on previous measurements. Solenoid pulse length will be ignored when this is enabled.',
        unit: '',
        advanced: true,
        validation: {
          type: 'toggle' as const,
          offLabel: 'Off',
          onLabel: 'On',
          tristate: true
        }
      },
      // No point in configuring this, it will be updated when measuring profiles

      // PERSISTENT_PULSE_LEN_US: {
      //   key: 'PERSISTENT_PULSE_LEN_US',
      //   label: 'Default Persistent Pulse Length',
      //   description: 'Pulse length for persistent pulse length feature (only an initial value, will be updated when measuring profiles)',
      //   unit: 'µs',
      //   advanced: true,
      //   validation: {
      //     type: 'float' as const,
      //     min: 0,
      //     max: 15000
      //   }
      // },
      MEAS_IN_PROGRESS_CHART_Y_LIMIT: {
        key: 'MEAS_IN_PROGRESS_CHART_Y_LIMIT',
        label: 'Live Chart Y-axis Limit',
        description: 'Maximum value displayed on the live chart during measurement',
        unit: 'g',
        advanced: true,
        validation: {
          type: 'float' as const,
          min: 10,
          max: 1000
        }
      },
      DYNAMIC_SCALING: {
        key: 'DYNAMIC_SCALING',
        label: 'Live Chart Dynamic Scaling',
        description: 'Enable dynamic scaling of the live chart. Automatically adjusts maximum value displayed if y-axis limit is exceeded.',
        unit: '',
        advanced: true,
        validation: {
          type: 'toggle' as const,
          offLabel: 'Off',
          onLabel: 'On',
          tristate: true
        }
      },
      ENABLE_GAVG: {
        key: 'ENABLE_GAVG',
        label: 'Enable Gaussian Averaging',
        description: 'Enable gaussian averaging for measurement files',
        unit: '',
        advanced: true,
        validation: {
          type: 'toggle' as const,
          offLabel: 'Off',
          onLabel: 'On',
          tristate: true
        }
      },
      HAMMER_FORCE_MODE: {
        key: 'HAMMER_FORCE_MODE',
        label: 'Hammer Force Mode',
        description: 'Adjusts hammer force in profile measurement',
        unit: '',
        advanced: true,
        validation: {
          type: 'select' as const,
          options: [
            { label: 'Standard', value: 0 },
            { label: 'Low', value: 1 },
            { label: 'High', value: 2 }
          ]
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
      GFILTER_STD: {
        key: 'GFILTER_STD',
        label: 'Gaussian Filter Standard Deviation',
        description: 'Standard deviation for the gaussian filter',
        unit: '',
        advanced: true,
        validation: {
          type: 'float' as const,
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
      ADC_ACCEL_0G: {
        key: 'ADC_ACCEL_0G',
        label: 'Accelerometer sensor value at 0g',
        description: 'Sensor value at 0g (used for calibration)',
        unit: '',
        advanced: true,
        validation: {
          type: 'float' as const,
          min: 0,
          max: 4095
        }
      },
      ADC_ACCEL_STEP: {
        key: 'ADC_ACCEL_STEP',
        label: 'Accelerometer sensor value step',
        description: 'Step size for accelerometer sensor value (steps per g)',
        unit: '1/g',
        advanced: true,
        validation: {
          type: 'float' as const,
          min: 0,
          max: 20
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