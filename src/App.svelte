<script lang="ts">
  import { defaultConfigs } from './types'
  import type { ConfigItem, AlertLimitItem, ConfigSection as ConfigSectionType } from './types'
  import ConfigSection from './lib/ConfigSection.svelte'
  import QRDisplay from './lib/QRDisplay.svelte'
  import { QR_CONFIG } from './config/settings'
    import Footer from './lib/Footer.svelte';
    import Header from './lib/Header.svelte';

  let configSections = defaultConfigs
  let text = ''
  let showWarning = false

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

  $: configValues = configSections.flatMap(section => section.items.map(item =>
    'value' in item ? item.value : [item.minValue, item.maxValue]
  ).flat())
  $: if (configValues) {
    updateConfigText()
  }
</script>

<main>
  <div class="container">
    <Header />

    <div class="card">
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
            {#each configSections as section (section.id)}
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
    padding: 0 1rem;
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
</style>
