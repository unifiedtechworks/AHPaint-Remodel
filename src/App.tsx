import './App.css'
import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import MobileContactBar from './components/MobileContactBar'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import { businessInfo, type Service } from './data/business'
import { featuredProjects, type Project } from './data/projects'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  children?: ReactNode
}

const reasons = [
  'Residential and small commercial experience',
  'Local service in and around Hermiston',
  businessInfo.experienceLabel,
  'Painting and remodeling handled by one reliable contractor',
]

const serviceAreaList = [...businessInfo.serviceAreas, businessInfo.serviceAreaRegion].join(', ')

const trustItems = [
  `${businessInfo.trust.yearsExperience}+ Years Experience`,
  ...(businessInfo.trust.insured ? ['Licensed, Bonded & Insured'] : []),
  businessInfo.trust.customerTypes.join(' & '),
  'Serving Eastern Oregon',
]

const focusableElementSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableElementSelector)).filter((element) => {
    const isHidden = element.hidden || element.getAttribute('aria-hidden') === 'true'
    const isVisible = element.offsetParent !== null || element.getClientRects().length > 0

    return !isHidden && isVisible
  })
}

function SectionHeader({ eyebrow, title, children }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children && <div className="section-header__copy">{children}</div>}
    </div>
  )
}

function ServiceCardComponent({ title, description }: Service) {
  return (
    <article className="card service-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

function TrustStrip() {
  return (
    <section className="trust-strip section-wrap" aria-label="Verified business information">
      <ul>
        {trustItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

interface ProjectCardProps {
  project: Project
  onSelect: (project: Project, event: MouseEvent<HTMLButtonElement>) => void
}

function getProjectImages(project: Project) {
  return project.images
}

function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const { title, category, location, description, images } = project
  const coverImage = images[0]

  return (
    <button className="project-card" type="button" onClick={(event) => onSelect(project, event)}>
      {coverImage ? (
        <img
          className="project-card__image"
          src={coverImage.thumbnailSrc}
          srcSet={coverImage.srcSet}
          sizes={coverImage.sizes}
          width={coverImage.width}
          height={coverImage.height}
          alt={coverImage.alt}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="project-card__placeholder">Project photos coming soon.</div>
      )}
      <div className="project-card__content">
        <p className="project-card__category">{category}</p>
        <h3>{title}</h3>
        <p className="project-card__location">{location}</p>
        <p>{description}</p>
      </div>
    </button>
  )
}

interface ProjectLightboxProps {
  project: Project
  onClose: () => void
}

function ProjectLightbox({ project, onClose }: ProjectLightboxProps) {
  const images = useMemo(() => getProjectImages(project), [project])
  const [activeIndex, setActiveIndex] = useState(0)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const activeImage = images[activeIndex]
  const hasMultipleImages = images.length > 1

  useEffect(() => {
    setActiveIndex(0)
  }, [project])

  useEffect(() => {
    document.body.classList.add('body--modal-open')

    return () => {
      document.body.classList.remove('body--modal-open')
    }
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })
  }, [project])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'Tab') {
        const panel = panelRef.current

        if (!panel) {
          return
        }

        const focusableElements = getFocusableElements(panel)

        if (focusableElements.length === 0) {
          event.preventDefault()
          panel.focus()
          return
        }

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (focusableElements.length === 1) {
          event.preventDefault()
          firstElement.focus()
          return
        }

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
          return
        }

        if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }

        return
      }

      if (!hasMultipleImages) {
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setActiveIndex((currentIndex) => (currentIndex === 0 ? images.length - 1 : currentIndex - 1))
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setActiveIndex((currentIndex) => (currentIndex === images.length - 1 ? 0 : currentIndex + 1))
      }
    }

    function handleFocusIn(event: FocusEvent) {
      const panel = panelRef.current

      if (!panel || !(event.target instanceof Node) || panel.contains(event.target)) {
        return
      }

      const firstFocusableElement = getFocusableElements(panel)[0]
      ;(firstFocusableElement ?? panel).focus()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('focusin', handleFocusIn)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('focusin', handleFocusIn)
    }
  }, [hasMultipleImages, images.length, onClose])

  function showPreviousImage() {
    setActiveIndex((currentIndex) => (currentIndex === 0 ? images.length - 1 : currentIndex - 1))
  }

  function showNextImage() {
    setActiveIndex((currentIndex) => (currentIndex === images.length - 1 ? 0 : currentIndex + 1))
  }

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-title" aria-describedby="lightbox-description" onClick={onClose}>
      <div className="lightbox__panel" ref={panelRef} tabIndex={-1} onClick={(event) => event.stopPropagation()}>
        <button className="lightbox__close" ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close project gallery">
          ×
        </button>
        <div className="lightbox__media">
          {activeImage ? (
            <img
              src={activeImage.largeSrc}
              srcSet={activeImage.srcSet}
              sizes="(max-width: 1120px) 92vw, 1120px"
              width={activeImage.width}
              height={activeImage.height}
              alt={activeImage.alt}
              decoding="async"
            />
          ) : (
            <div className="lightbox__placeholder">Project photos coming soon.</div>
          )}
          {hasMultipleImages && (
            <div className="lightbox__controls" aria-label="Project image controls">
              <button type="button" onClick={showPreviousImage} aria-label="Previous project image">‹</button>
              <span>{activeIndex + 1} / {images.length}</span>
              <button type="button" onClick={showNextImage} aria-label="Next project image">›</button>
            </div>
          )}
        </div>
        <div className="lightbox__content">
          <p className="project-card__category">{project.category}</p>
          <h2 id="lightbox-title">{project.title}</h2>
          <p className="project-card__location">{project.location}</p>
          <p id="lightbox-description">{project.description}</p>
          {hasMultipleImages && (
            <div className="lightbox__thumbs" aria-label="Project image thumbnails">
              {images.map((image, index) => (
                <button
                  className={index === activeIndex ? 'lightbox__thumb lightbox__thumb--active' : 'lightbox__thumb'}
                  type="button"
                  key={image.src}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show image ${index + 1} of ${images.length}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                >
                  <img src={image.thumbnailSrc} width={image.width} height={image.height} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const lightboxOpenerRef = useRef<HTMLElement | null>(null)
  const phoneHref = `tel:${businessInfo.phone.replace(/\D/g, '')}`
  const textHref = `sms:${businessInfo.phone.replace(/\D/g, '')}`
  const emailHref = `mailto:${businessInfo.email}`

  function openProject(project: Project, event: MouseEvent<HTMLButtonElement>) {
    lightboxOpenerRef.current = event.currentTarget
    setSelectedProject(project)
  }

  function closeProjectLightbox() {
    setSelectedProject(null)

    requestAnimationFrame(() => {
      const opener = lightboxOpenerRef.current

      if (opener?.isConnected) {
        opener.focus()
      }
    })
  }

  return (
    <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <SiteHeader />
    <main id="main-content">
      <section className="hero section-wrap">
        <div className="hero__content">
          <p className="eyebrow">General Contractor in Hermiston, Oregon</p>
          <h1>{businessInfo.businessName}</h1>
          <p className="hero__lead">
            Quality painting and remodeling services for homes and small businesses throughout the greater Hermiston area. {businessInfo.businessName} delivers dependable craftsmanship, clear communication, and lasting results.
          </p>
          <div className="hero__actions" aria-label="Contact options">
            <a className="button button--primary" href={phoneHref}>Call Aaron</a>
            <a className="button button--secondary" href={textHref}>Text Aaron</a>
            <a className="button button--secondary" href={emailHref}>Email Aaron</a>
          </div>
          <p className="hero__contact-note">{businessInfo.phone} · {businessInfo.email}</p>
        </div>
        {businessInfo.heroImage && (
          <div className="hero-image" aria-label="Featured project image">
            <img src={businessInfo.heroImage.src} alt={businessInfo.heroImage.alt} />
          </div>
        )}
        <aside className="hero-card" aria-label="Business highlights">
          <span className="hero-card__number">{businessInfo.trust.yearsExperience}+</span>
          <p className="hero-card__label">Years Experience</p>
          <ul>
            <li>{businessInfo.trust.customerTypes[0]} projects</li>
            <li>{businessInfo.trust.customerTypes[1]} work</li>
            <li>{businessInfo.serviceArea}</li>
          </ul>
        </aside>
      </section>

      <TrustStrip />

      <section className="section section-wrap" id="about">
        <SectionHeader eyebrow="About" title="Local paint and remodel help for practical property improvements.">
          <p>
            With more than {businessInfo.trust.yearsExperience} years of experience, {businessInfo.businessName} provides licensed, bonded, and insured residential and small commercial painting and remodeling services throughout the Hermiston area and surrounding Eastern Oregon communities.
          </p>
        </SectionHeader>
      </section>

      <section className="section section-wrap" id="services">
        <SectionHeader eyebrow="Services" title="Painting, remodeling, and finish work for homes and small businesses.">
          <p>Whether you're updating a single room or tackling multiple improvements at once, {businessInfo.businessName} offers dependable solutions tailored to your property and goals.</p>
        </SectionHeader>
        <div className="services-grid">
          {businessInfo.services.map((service) => (
            <ServiceCardComponent key={service.title} {...service} />
          ))}
        </div>
      </section>

      <section className="section section-wrap" id="featured-projects">
        <SectionHeader eyebrow="Portfolio" title="Featured Projects">
          <p>Examples of painting, flooring, remodeling, and finish work completed for local customers.</p>
        </SectionHeader>
        {featuredProjects.length > 0 ? (
          <div className="projects-grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onSelect={openProject} />
            ))}
          </div>
        ) : (
          <div className="projects-empty">Project photos coming soon.</div>
        )}
      </section>

      <section className="section section-wrap why-section" id="why-choose">
        <SectionHeader eyebrow="Why Choose Us" title="Straightforward service from a local contractor.">
          <p>
            Choosing the right contractor matters. {businessInfo.businessName} focuses on dependable service, straightforward communication, and quality work that homeowners and small businesses can rely on.
          </p>
        </SectionHeader>
        <div className="reason-grid">
          {reasons.map((reason) => (
            <div className="reason" key={reason}>
              <span aria-hidden="true">✓</span>
              <p>{reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-wrap service-area" id="service-area">
        <SectionHeader eyebrow="Service Area" title={`Serving the ${businessInfo.serviceArea}.`}>
          <p>
            Serving {serviceAreaList} with residential and small commercial painting, remodeling, flooring, bathroom, window, door, and exterior improvement services.
          </p>
          <p>
            Call, text, or email Aaron to discuss your project and confirm availability for your location.
          </p>
        </SectionHeader>
      </section>

      <section className="section section-wrap contact-section" id="contact">
        <SectionHeader eyebrow="Contact" title="Ready to discuss your project?">
          <p>
            Call, text, or email Aaron to talk through your painting or remodeling needs. Whether you're planning a small update or a larger project, Aaron Hansen Paint & Remodel LLC is available to discuss the details and next steps.
          </p>
        </SectionHeader>
        <div className="contact-card">
          <a className="contact-card__action" href={phoneHref}>Call Aaron</a>
          <a className="contact-card__action" href={textHref}>Text Aaron</a>
          <a className="contact-card__action" href={emailHref}>Email Aaron</a>
          <p>{businessInfo.serviceArea}</p>
        </div>
      </section>
      {selectedProject && <ProjectLightbox project={selectedProject} onClose={closeProjectLightbox} />}
    </main>
    <SiteFooter />
    <MobileContactBar />
    </>
  )
}

export default App