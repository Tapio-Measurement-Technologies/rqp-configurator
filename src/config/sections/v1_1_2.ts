import type { SectionConfig } from '../../types'
import { SECTIONS as v1_1_1 } from './v1_1_1'

const { GFILTER_STD: _gfilterStd, ...systemItems } = v1_1_1.SYSTEM.items

export const SECTIONS: Record<string, SectionConfig> = {
  ...v1_1_1,
  SYSTEM: {
    ...v1_1_1.SYSTEM,
    items: {
      ...systemItems,
      ACCEL_GFILTER_STD: {
        key: 'ACCEL_GFILTER_STD',
        label: 'Accelerometer Gaussian Filter Standard Deviation',
        description: 'Standard deviation for gaussian filtering raw accelerometer data',
        unit: '',
        advanced: true,
        validation: {
          type: 'float' as const
        }
      },
      PRO_GFILTER_STD: {
        key: 'PRO_GFILTER_STD',
        label: 'Raw Profile Gaussian Filter Standard Deviation',
        description: 'Standard deviation for gaussian averaging raw profile data',
        unit: '',
        advanced: true,
        validation: {
          type: 'float' as const,
          min: 0
        }
      },
      PROFILE_DISCARD_DIST_MM: {
        key: 'PROFILE_DISCARD_DIST_MM',
        label: 'Profile Discard Distance',
        description: 'Profiles shorter than this length are automatically discarded to prevent accidental measurements',
        unit: 'mm',
        advanced: true,
        validation: {
          type: 'float' as const,
          min: 0,
          max: 1000
        }
      },
    }
  }
}
