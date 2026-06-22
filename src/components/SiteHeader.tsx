import { businessInfo } from '../data/business'

const navigationLinks = [
  { href: '#services', label: 'Services' },
  { href: '#featured-projects', label: 'Projects' },
  { href: '#service-area', label: 'Service Area' },
  { href: '#contact', label: 'Contact' },
]

function SiteHeader() {
  const phoneHref = `tel:${businessInfo.phone.replace(/\D/g, '')}`

  return (
    <header className="site-header">
      <div className="site-header__inner section-wrap">
        <a className="site-header__brand" href="#main-content">
          Aaron Hansen Paint &amp; Remodel
        </a>

        <nav className="site-header__nav" aria-label="Primary navigation">
          {navigationLinks.map((link) => (
            <a className="site-header__link" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
          <a className="site-header__call" href={phoneHref}>
            Call Aaron
          </a>
        </nav>

        <a className="site-header__mobile-call" href={phoneHref}>
          Call
        </a>
      </div>
    </header>
  )
}

export default SiteHeader