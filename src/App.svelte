<script lang="ts">
  import ConfigSection from './lib/ConfigSection.svelte'
  import QRDisplay from './lib/QRDisplay.svelte'
  import { UI_CONFIG, QR_CONFIG } from './config/settings'
  import Footer from './lib/Footer.svelte';
  import Header from './lib/Header.svelte';
  import WarningIcon from './assets/icons/warning.svg?raw'
  import { configStore, visibleSections, showAdvancedStore } from './stores/configStore'
  import { qrText } from './stores/qrStore'

  $: {
    if (!$showAdvancedStore) {
      configStore.resetAdvancedValues()
    } else {
      configStore.updateVisibleSectionValues($visibleSections)
    }
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
            bind:checked={$showAdvancedStore}
          />
          <span class="slider"></span>
          <span class="label">Show Advanced Settings</span>
        </label>
      </div>

      {#if $showAdvancedStore}
        <div class="advanced-warning">
          {@html WarningIcon}
          <span>{UI_CONFIG.ADVANCED_WARNING}</span>
        </div>
      {/if}

      {#if $qrText.showWarning}
        <div class="warning-message">
          Warning: Only the first {QR_CONFIG.MAX_CONFIG_VALUES} configuration values will be included in the QR code.
        </div>
      {/if}

      <div class="content-grid">
        <div class="input-section">
          <div class="section-header">
            <h2>Configuration Values</h2>
            <button type="button" class="clear-button" on:click={() => configStore.clearAllValues()}>
              Clear All
            </button>
          </div>
          <div class="config-list">
            {#each $visibleSections as section (section.id)}
              <ConfigSection bind:section />
            {/each}
          </div>
        </div>

        <QRDisplay text={$qrText.text} />
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
    gap: 1rem;
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
    .card {
      padding: 1.5rem;
      border-radius: 12px;
    }

    .container {
      padding: 1rem;
    }
  }
</style>
