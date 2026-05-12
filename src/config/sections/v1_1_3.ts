import type { SectionConfig } from '../../types'
import { SECTIONS as v1_1_2 } from './v1_1_2'

export const SECTIONS: Record<string, SectionConfig> = {
  ...v1_1_2,
  BASIC: {
    ...v1_1_2.BASIC,
    items: {
      ...v1_1_2.BASIC.items,
      LOCALE: {
        ...v1_1_2.BASIC.items.LOCALE,
        validation: {
          ...v1_1_2.BASIC.items.LOCALE.validation,
          type: 'select' as const,
          options: [
            { label: 'English', value: 'en' },
            { label: 'Suomi', value: 'fi' },
            { label: 'Deutsch', value: 'de' },
            { label: '日本語', value: 'ja' },
            { label: '简体中文', value: 'zh-cn' }
          ]
        }
      }
    }
  }
}
