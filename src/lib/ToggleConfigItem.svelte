<script lang="ts">
  import type { ConfigItem } from '../types'
  import { UI_CONFIG } from '../config/settings'

  export let item: ConfigItem

  function handleToggle() {
    item.value = item.value === '1' ? '0' : '1'
  }

  $: isChecked = item.value === '1'
  $: validation = item.validation as { type: 'toggle'; offLabel?: string; onLabel?: string }
</script>

<div class="config-item">
  <div class="config-info">
    <div class="label-row">
      <label for={item.key} class="config-label">{item.label}</label>
      {#if UI_CONFIG.SHOW_CONFIG_KEYS}
        <span class="config-key">{item.key}</span>
      {/if}
    </div>
    <span class="config-description">{item.description}</span>
  </div>
  <div class="value-input">
    <label class="toggle">
      <input
        type="checkbox"
        id={item.key}
        checked={isChecked}
        on:change={handleToggle}
      />
      <span class="slider"></span>
      <span class="toggle-label">
        {isChecked ? (validation.onLabel || 'On') : (validation.offLabel || 'Off')}
      </span>
    </label>
  </div>
</div>

<style>
  .config-item {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 1.5rem;
    align-items: center;
    padding: 0.75rem;
    background-color: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .config-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .label-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .config-label {
    font-size: 1rem;
    font-weight: 600;
    color: #1a1a1a;
  }

  .config-key {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.8rem;
    color: #64748b;
    padding: 0.2rem 0.4rem;
    background-color: #f1f5f9;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }

  .config-description {
    font-size: 0.85rem;
    color: #64748b;
    line-height: 1.3;
  }

  .value-input {
    display: flex;
    align-items: center;
    justify-content: flex-start;
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

  .toggle-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1a1a1a;
    min-width: 32px;
  }

  @media (max-width: 768px) {
    .config-item {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
  }
</style>