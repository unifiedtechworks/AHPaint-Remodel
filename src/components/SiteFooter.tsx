import { businessInfo } from '../data/business'

function SiteFooter() {
  const currentYear = new Date().getFullYear()
  const phoneHref = `tel:${businessInfo.phone.replace(/\D/g, '')}`
  const emailHref = `mailto:${businessInfo.email}`

  return (
    <footer className="site-footer">
      <div className="site-footer__inner section-wrap">
        <div className="site-footer__identity">
          <p className="site-footer__name">{businessInfo.businessName}</p>
          <p className="site-footer__area">{businessInfo.serviceArea}</p>
          <p className="site-footer__copyright">© {currentYear} {businessInfo.businessName}</p>
          <p className="site-footer__management">
            Site managed by{' '}
            <a
              href="https://unifiedtechworks.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unified Techworks LLC
            </a>
          </p>
        </div>

        <nav className="site-footer__links" aria-label="Footer links">
          <a href={phoneHref}>Call Aaron</a>
          <a href={emailHref}>Email Aaron</a>
          <a href="#main-content">Back to Top</a>
        </nav>
      </div>
    </footer>
  )
}

export default SiteFooter