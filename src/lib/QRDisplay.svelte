<script lang="ts">
  import QRCode from 'qrcode'
  import { onMount } from 'svelte'
  import { QR_CONFIG } from '../config/settings'
  import QRPlaceholderIcon from '../assets/icons/qr-placeholder.svg?raw'
  import DownloadIcon from '../assets/icons/download.svg?raw'
  import CopyIcon from '../assets/icons/copy.svg?raw'

  export let text: string

  let qrCanvas: HTMLCanvasElement
  let errorMessage = ''
  let copyMessage = ''
  let copyTimeout: ReturnType<typeof setTimeout> | undefined

  function getQRContent(input: string): string {
    return `${QR_CONFIG.SOH_CHARACTER}${QR_CONFIG.CONFIG_PREFIX}${input}`
  }

  function generateQR() {
    errorMessage = ''
    if (!text || !text.trim()) {
      return
    }
    const qrContent = getQRContent(text)
    QRCode.toCanvas(qrCanvas, qrContent, QR_CONFIG.QR_OPTIONS).catch((err: Error) => {
      errorMessage = 'Error generating QR code: ' + err.message
    })
  }

  function formatContentWithHex(input: string): string {
    const qrContent = getQRContent(input)
    return qrContent.split('').map((char, i) => {
      if (i === 0) return '\\x01' // SOH character
      return char
    }).join('')
  }

  async function copyToClipboard() {
    if (!qrCanvas) return

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) =>
        qrCanvas.toBlob(blob => resolve(blob!), 'image/png')
      )

      // Create ClipboardItem and copy
      const item = new ClipboardItem({ 'image/png': blob })
      await navigator.clipboard.write([item])

      copyMessage = 'Copied!'
      if (copyTimeout) clearTimeout(copyTimeout)
      copyTimeout = setTimeout(() => copyMessage = '', 2000)
    } catch (err) {
      copyMessage = 'Failed to copy'
      if (copyTimeout) clearTimeout(copyTimeout)
      copyTimeout = setTimeout(() => copyMessage = '', 2000)
    }
  }

  function downloadQR() {
    if (!qrCanvas) return

    const link = document.createElement('a')
    link.download = 'rqp-config-qr.png'
    link.href = qrCanvas.toDataURL('image/png')
    link.click()
  }

  function isQREmpty(): boolean {
    return !text || !text.trim();
  }

  $: if (text !== undefined) {
    generateQR()
  }

  onMount(() => {
    generateQR()
  })
</script>

<div class="qr-section">
  <div class="qr-container">
    {#if !text}
      <div class="placeholder">
        {@html QRPlaceholderIcon}
        <span>Enter configuration values to generate QR code</span>
      </div>
    {/if}
    <canvas bind:this={qrCanvas} class:hidden={!text}></canvas>
  </div>
  <div class="button-group">
    <button
      type="button"
      class="action-button download-button"
      on:click={downloadQR}
      disabled={isQREmpty()}
      title={isQREmpty() ? 'Generate a QR code first' : 'Download QR code as image'}
    >
      {@html DownloadIcon}
      <span>Download image</span>
    </button>
    <button
      type="button"
      class="action-button copy-button"
      on:click={copyToClipboard}
      disabled={isQREmpty()}
      title={isQREmpty() ? 'Generate a QR code first' : 'Copy QR code to clipboard'}
    >
      {@html CopyIcon}
      <span>
        {#if copyMessage}
          {copyMessage}
        {:else}
          Copy to clipboard
        {/if}
      </span>
    </button>
  </div>
  {#if text}
    <div class="content-section">
      <div class="content-header">
        <p class="qr-text">Raw data:</p>
      </div>
      <pre class="code-block">{formatContentWithHex(text)}</pre>
    </div>
  {/if}
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
</div>

<style>
  .qr-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .qr-container {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    display: inline-block;
    border: 2px solid #e2e8f0;
    min-width: 300px;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    height: 300px;
    width: 300px;
    color: #94a3b8;
  }

  .placeholder span {
    font-size: 0.95rem;
  }

  .hidden {
    display: none;
  }

  .qr-text {
    color: #4b5563;
    font-size: 0.95rem;
    margin: 0;
    font-weight: 500;
  }

  .code-block {
    background-color: #f8f9fa;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    font-family: monospace;
    font-size: 0.9rem;
    color: #1a1a1a;
    margin: 0;
    max-width: 100%;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .error {
    color: #dc2626;
    margin: 1rem 0;
    font-weight: 500;
    background-color: #fee2e2;
    padding: 0.75rem;
    border-radius: 8px;
  }

  .content-section {
    width: 100%;
  }

  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .button-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin: 0;
    min-width: 368px;
  }

  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 8px;
    background-color: white;
    color: var(--text-color, #1a1a1a);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-button:hover {
    background-color: var(--button-background, #f9f9f9);
    border-color: var(--link-color, #646cff);
  }

  .action-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: var(--border-color, #e2e8f0);
    background-color: var(--button-background, #f9f9f9);
  }

  .action-button:disabled:hover {
    border-color: var(--border-color, #e2e8f0);
    background-color: var(--button-background, #f9f9f9);
  }

  @media (max-width: 640px) {
    .button-group {
      grid-template-columns: 1fr;
    }
  }
</style>