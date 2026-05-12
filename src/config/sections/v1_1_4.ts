import type { SectionConfig } from '../../types'
import { SECTIONS as v1_1_3 } from './v1_1_3'

const { SYSTEM, ...sectionsBeforeSystem } = v1_1_3

export const SECTIONS: Record<string, SectionConfig> = {
  ...sectionsBeforeSystem,
  BASIC: {
    ...v1_1_3.BASIC,
    items: {
      ...v1_1_3.BASIC.items,
      AUTO_START_MEASUREMENT: {
        key: 'auto_start_measurement',
        label: 'Quick Measurement',
        description: 'Start a measurement in a new folder automatically when pressing device down on a surface',
        unit: '',
        validation: {
          type: 'toggle' as const,
          offLabel: 'Off',
          onLabel: 'On',
          tristate: true
        }
      }
    }
  },
  DISPLAY: {
    id: 'display',
    title: 'Display Settings',
    items: {
      DISTANCE_UNIT: {
        key: 'distance_unit',
        label: 'Distance Unit',
        description: 'Unit used when displaying distances',
        unit: '',
        validation: {
          type: 'select' as const,
          options: [
            { label: 'Centimeters', value: 'cm' },
            { label: 'Inches', value: 'in' }
          ]
        }
      },
      VERTICAL_AXIS_SCALING_MODE: {
        key: 'vertical_axis_scaling_mode',
        label: 'Y-axis Scaling',
        description: 'Scaling mode for measurement chart y-axis',
        unit: '',
        validation: {
          type: 'select' as const,
          options: [
            { label: 'Full range', value: 'full_range' },
            { label: 'Automatic', value: 'automatic' }
          ]
        }
      },
      VERTICAL_AXIS_OVERRIDE_MIN: {
        key: 'vertical_axis_override_min',
        label: 'Y-axis Override Minimum',
        description: 'Manual lower y-axis bound. Use -1 to leave unset.',
        unit: 'g',
        validation: {
          type: 'float' as const,
          min: -1
        }
      },
      VERTICAL_AXIS_OVERRIDE_MAX: {
        key: 'vertical_axis_override_max',
        label: 'Y-axis Override Maximum',
        description: 'Manual upper y-axis bound. Use -1 to leave unset.',
        unit: 'g',
        validation: {
          type: 'float' as const,
          min: -1
        }
      },
      HARDNESS_HIGHLIGHT_MODE: {
        key: 'hardness_highlight_mode',
        label: 'Hardness Highlight Mode',
        description: 'Highlight mode for measurement detail chart hardness band',
        unit: '',
        validation: {
          type: 'select' as const,
          options: [
            { label: 'Off', value: 'off' },
            { label: 'Fixed', value: 'fixed' },
            { label: 'Relative to mean', value: 'relative_to_mean' },
            { label: 'Relative to mean (%)', value: 'relative_to_mean_percent' }
          ]
        }
      },
      HARDNESS_HIGHLIGHT_COLOR: {
        key: 'hardness_highlight_color',
        label: 'Hardness Highlight Color',
        description: 'Color for measurement detail chart hardness highlight',
        unit: '',
        validation: {
          type: 'select' as const,
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Orange', value: 'orange' },
            { label: 'Red', value: 'red' },
            { label: 'Cyan', value: 'cyan' },
            { label: 'Green', value: 'green' },
            { label: 'Yellow', value: 'yellow' },
            { label: 'Purple', value: 'purple' },
            { label: 'Pink', value: 'pink' },
            { label: 'Brown', value: 'brown' },
            { label: 'Gray', value: 'gray' }
          ]
        }
      },
      HARDNESS_HIGHLIGHT_MIN: {
        key: 'hardness_highlight_min',
        label: 'Hardness Highlight Minimum',
        description: 'Lower hardness highlight bound',
        unit: 'g',
        validation: {
          type: 'float' as const
        }
      },
      HARDNESS_HIGHLIGHT_MAX: {
        key: 'hardness_highlight_max',
        label: 'Hardness Highlight Maximum',
        description: 'Upper hardness highlight bound',
        unit: 'g',
        validation: {
          type: 'float' as const
        }
      }
    }
  },
  SYSTEM: {
    ...SYSTEM
  }
}
