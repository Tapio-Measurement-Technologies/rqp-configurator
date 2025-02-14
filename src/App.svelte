<script lang="ts">
  import { defaultConfigs } from './types'
  import type { ConfigItem, AlertLimitItem, ConfigSection as ConfigSectionType } from './types'
  import ConfigSection from './lib/ConfigSection.svelte'
  import QRDisplay from './lib/QRDisplay.svelte'
  import { QR_CONFIG, UI_CONFIG } from './config/settings'
  import Footer from './lib/Footer.svelte';
  import Header from './lib/Header.svelte';
  import { onMount } from 'svelte';

  let configSections = defaultConfigs
  let text = ''
  let showWarning = false
  let showAdvanced = false
  let syncTime = true
  let currentTimestamp = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 1000)

  // Update timestamp periodically
  let timestampInterval: NodeJS.Timeout

  onMount(() => {
    timestampInterval = setInterval(() => {
      if (syncTime) {
        currentTimestamp = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 1000)
        updateConfigText()
      }
    }, UI_CONFIG.TIME_SYNC_UPDATE_INTERVAL)

    return () => {
      clearInterval(timestampInterval)
    }
  })

  function updateConfigText() {
    const configPairs = configSections
      .flatMap(section => section.items as (ConfigItem | AlertLimitItem)[])
      .flatMap((item: ConfigItem | AlertLimitItem) => {
        if ('value' in item) {
          return item.value.trim() ? [`${item.key}=${item.value}`] : []
        }
        const minKey = `${item.key}_min`
        const maxKey = `${item.key}_max`
        return [
          ...(item.minValue.trim() ? [`${minKey}=${item.minValue}`] : []),
          ...(item.maxValue.trim() ? [`${maxKey}=${item.maxValue}`] : [])
        ]
      })

    // Add time sync if enabled
    if (syncTime) {
      configPairs.push(`SETTIME=${currentTimestamp}`)
    }

    const validConfigs = configPairs.slice(0, QR_CONFIG.MAX_CONFIG_VALUES).join(';')
    text = validConfigs
    showWarning = configPairs.length > QR_CONFIG.MAX_CONFIG_VALUES
  }

  function clearAllValues() {
    configSections = configSections.map(section => {
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
  }

  function resetAdvancedValues() {
    configSections = configSections.map(section => {
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
          item.advanced ? { ...item, value: '' } : item
        )
      }
    }) as ConfigSectionType[]
  }

  $: visibleSections = configSections.map(section => {
    const filteredItems = section.type === 'alert_limits'
      ? (section.items as AlertLimitItem[]).filter(item => showAdvanced || !item.advanced)
      : (section.items as ConfigItem[]).filter(item => showAdvanced || !item.advanced)

    return {
      ...section,
      items: filteredItems
    }
  }).filter(section => section.items.length > 0)

  $: {
    if (!showAdvanced) {
      resetAdvancedValues()
    } else {
      visibleSections.forEach(visibleSection => {
        const originalSection = configSections.find(s => s.id === visibleSection.id)
        if (originalSection) {
          visibleSection.items.forEach(item => {
            const originalItem = originalSection.items.find(i =>
              'key' in item && 'key' in i && item.key === i.key
            )
            if (originalItem) {
              if ('value' in item && 'value' in originalItem) {
                originalItem.value = item.value
              } else if ('minValue' in item && 'minValue' in originalItem) {
                originalItem.minValue = item.minValue
                originalItem.maxValue = item.maxValue
              }
            }
          })
        }
      })
    }
    updateConfigText()
  }
</script>

<main>
  <div class="container">
    <Header />

    <div class="card">
      <div class="settings-toggles">
        <label class="toggle">
          <input
            type="checkbox"
            bind:checked={syncTime}
            on:change={updateConfigText}
          />
          <span class="slider"></span>
          <span class="label">Sync device time</span>
        </label>

        <label class="toggle">
          <input
            type="checkbox"
            bind:checked={showAdvanced}
          />
          <span class="slider"></span>
          <span class="label">Show Advanced Settings</span>
        </label>
      </div>

      {#if showAdvanced}
        <div class="advanced-warning">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>{UI_CONFIG.ADVANCED_WARNING}</span>
        </div>
      {/if}

      {#if showWarning}
        <div class="warning-message">
          Warning: Only the first {QR_CONFIG.MAX_CONFIG_VALUES} configuration values will be included in the QR code.
        </div>
      {/if}

      <div class="content-grid">
        <div class="input-section">
          <div class="section-header">
            <h2>Configuration Values</h2>
            <button type="button" class="clear-button" on:click={clearAllValues}>
              Clear All
            </button>
          </div>
          <div class="config-list">
            {#each visibleSections as section (section.id)}
              <ConfigSection bind:section />
            {/each}
          </div>
        </div>

        <QRDisplay {text} />
      </div>
    </div>
  </div>

  <Footer />
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f0f2f5;
    min-height: 100vh;
  }

  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: 2rem 1rem;
    flex: 1;
  }

  .card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  }

  .input-section {
    padding-right: 2rem;
    border-right: 1px solid #e2e8f0;
  }

  .config-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .settings-toggles {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }

  .toggle input {
    display: none;
  }

  .slider {
    position: relative;
    width: 48px;
    height: 24px;
    background-color: #e2e8f0;
    border-radius: 24px;
    transition: all 0.2s ease;
  }

  .slider:before {
    content: "";
    position: absolute;
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  input:checked + .slider {
    background-color: #3b82f6;
  }

  input:checked + .slider:before {
    transform: translateX(24px);
  }

  .label {
    font-size: 0.95rem;
    font-weight: 500;
    color: #1a1a1a;
  }

  .advanced-warning {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: #fff3cd;
    border: 1px solid #ffeeba;
    border-radius: 8px;
    color: #856404;
  }

  .advanced-warning svg {
    flex-shrink: 0;
    color: #856404;
  }

  .warning-message {
    background-color: #fff3cd;
    color: #856404;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border: 1px solid #ffeeba;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .warning-message::before {
    content: "⚠️";
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .section-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
  }

  .clear-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    color: #dc2626;
    background-color: transparent;
    border: 1px solid #dc2626;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .clear-button:hover {
    background-color: #dc2626;
    color: white;
  }

  .clear-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
  }

  @media (max-width: 768px) {
    .content-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .input-section {
      padding-right: 0;
      border-right: none;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2rem;
    }
  }

  @media (max-width: 640px) {
    h1 {
      font-size: 2rem;
    }

    .card {
      padding: 1.5rem;
      border-radius: 12px;
    }

    .container {
      padding: 1rem;
    }
  }
</style>
