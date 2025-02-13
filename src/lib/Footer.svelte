<footer class="footer">
  <div class="container">
    <div class="footer-content">
      <div class="footer-branding">
        <div class="company">
          <strong>RQP Live</strong>
          <span class="separator">|</span>
          <span>Roll Quality Profiler</span>
        </div>
        <div class="copyright">
          © {new Date().getFullYear()} Tapio Measurement Technologies. All rights reserved.
        </div>
      </div>
      <div class="footer-contact">
        <a href="mailto:info@tapiotechnologies.com" class="contact-link">
          info@tapiotechnologies.com
        </a>
        <a href="https://www.tapiotechnologies.com" target="_blank" rel="noopener noreferrer" class="contact-link">
          www.tapiotechnologies.com
        </a>
      </div>
    </div>
  </div>
</footer>

<style>
  .footer {
    margin-top: auto;
    background-color: white;
    border-top: 1px solid #e2e8f0;
    width: 100%;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: 2rem 1rem;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
  }

  .footer-branding {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .company {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #1a1a1a;
  }

  .company .separator {
    color: #94a3b8;
  }

  .copyright {
    color: #64748b;
    font-size: 0.9rem;
  }

  .footer-contact {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }

  .contact-link {
    color: #3b82f6;
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s ease;
  }

  .contact-link:hover {
    color: #2563eb;
    text-decoration: underline;
  }

  @media (max-width: 640px) {
    .container {
      padding: 1.5rem 1rem;
    }

    .footer-content {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1.5rem;
    }

    .footer-contact {
      align-items: center;
    }
  }
</style>