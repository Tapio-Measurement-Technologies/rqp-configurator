<script lang="ts">
  import type { ConfigSection, AlertLimitItem as AlertLimitItemType, ConfigItem as ConfigItemType, SelectConfigItem as SelectConfigItemType } from '../types'
  import { slide } from 'svelte/transition'
  import ConfigItem from './ConfigItem.svelte'
  import AlertLimitItem from './AlertLimitItem.svelte'
  import SelectConfigItem from './SelectConfigItem.svelte'
  import ToggleConfigItem from './ToggleConfigItem.svelte'
  import ArrowIcon from '../assets/icons/arrow.svg?raw'

  export let section: ConfigSection
  let isExpanded = section.defaultExpanded ?? false

  function toggleExpand() {
    isExpanded = !isExpanded
  }

  function isSelectItem(item: any): item is SelectConfigItemType {
    return item.validation?.type === 'select'
  }

  function isToggleItem(item: any): boolean {
    return item.validation?.type === 'toggle'
  }

  function isAlertLimitItem(item: any): item is AlertLimitItemType {
    return 'minValue' in item && 'maxValue' in item
  }

  $: {
    console.log('Section items changed:', section.items)
  }
</script>

<div class="config-section">
  <button
    class="section-header"
    on:click={toggleExpand}
    aria-expanded={isExpanded}
    aria-controls={`section-${section.id}`}
  >
    <div class="header-content">
      <h2>{section.title}</h2>
      <div class="arrow" class:expanded={isExpanded}>
        {@html ArrowIcon}
      </div>
    </div>
  </button>

  {#if isExpanded}
    <div
      class="section-content"
      id={`section-${section.id}`}
      transition:slide={{ duration: 200 }}
    >
      {#if section.type === 'alert_limits'}
        {#each section.items as item}
          <AlertLimitItem bind:item={item as AlertLimitItemType} />
        {/each}
      {:else}
        {#each section.items as item}
          {#if isSelectItem(item)}
            <SelectConfigItem bind:item={item as SelectConfigItemType} />
          {:else if isToggleItem(item)}
            <ToggleConfigItem bind:item={item as ConfigItemType} />
          {:else if !isAlertLimitItem(item)}
            <ConfigItem bind:item={item as ConfigItemType} />
          {/if}
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .config-section {
    width: 100%;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
  }

  .section-header {
    width: 100%;
    padding: 1rem 1.5rem;
    background-color: #f8fafc;
    border: none;
    border-bottom: 1px solid #e2e8f0;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .section-header:hover {
    background-color: #f1f5f9;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a1a;
  }

  .arrow {
    color: #64748b;
    transition: transform 0.2s ease;
  }

  .arrow.expanded {
    transform: rotate(180deg);
  }

  .section-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
</style>