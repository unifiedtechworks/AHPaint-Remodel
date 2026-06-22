import './App.css'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
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

interface ProjectCardProps {
  project: Project
  onSelect: (project: Project) => void
}

function getProjectImages(project: Project) {
  return project.galleryImages
}

function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const { title, category, description, coverImage } = project

  return (
    <button className="project-card" type="button" onClick={() => onSelect(project)}>
      {coverImage ? (
        <img className="project-card__image" src={coverImage} alt={`${title} project`} loading="lazy" />
      ) : (
        <div className="project-card__placeholder">Project photos coming soon.</div>
      )}
      <div className="project-card__content">
        <p className="project-card__category">{category}</p>
        <h3>{title}</h3>
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
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }

      if (!hasMultipleImages) {
        return
      }

      if (event.key === 'ArrowLeft') {
        setActiveIndex((currentIndex) => (currentIndex === 0 ? images.length - 1 : currentIndex - 1))
      }

      if (event.key === 'ArrowRight') {
        setActiveIndex((currentIndex) => (currentIndex === images.length - 1 ? 0 : currentIndex + 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [hasMultipleImages, images.length, onClose])

  function showPreviousImage() {
    setActiveIndex((currentIndex) => (currentIndex === 0 ? images.length - 1 : currentIndex - 1))
  }

  function showNextImage() {
    setActiveIndex((currentIndex) => (currentIndex === images.length - 1 ? 0 : currentIndex + 1))
  }

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-title" onClick={onClose}>
      <div className="lightbox__panel" onClick={(event) => event.stopPropagation()}>
        <button className="lightbox__close" type="button" onClick={onClose} aria-label="Close project gallery">
          ×
        </button>
        <div className="lightbox__media">
          {activeImage ? (
            <img src={activeImage} alt={`${project.title} project view ${activeIndex + 1}`} />
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
          <p>{project.description}</p>
          {hasMultipleImages && (
            <div className="lightbox__thumbs" aria-label="Project image thumbnails">
              {images.map((image, index) => (
                <button
                  className={index === activeIndex ? 'lightbox__thumb lightbox__thumb--active' : 'lightbox__thumb'}
                  type="button"
                  key={image}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show image ${index + 1} of ${images.length}`}
                >
                  <img src={image} alt="" />
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
  const phoneHref = `tel:${businessInfo.phone.replace(/\D/g, '')}`
  const textHref = `sms:${businessInfo.phone.replace(/\D/g, '')}`
  const emailHref = `mailto:${businessInfo.email}`

  return (
    <main>
      <section className="hero section-wrap">
        <div className="hero__content">
          <p className="eyebrow">Hermiston Area General Contractor</p>
          <h1>{businessInfo.businessName}</h1>
          <p className="hero__lead">
            Quality painting and remodeling services for homes and small businesses throughout the greater Hermiston area. {businessInfo.businessName} delivers dependable craftsmanship, clear communication, and lasting results.
          </p>
          <div className="hero__actions" aria-label="Contact options">
            <a className="button button--primary" href={phoneHref}>Call</a>
            <a className="button button--secondary" href={textHref}>Text</a>
            <a className="button button--secondary" href={emailHref}>Email</a>
          </div>
          <p className="hero__contact-note">{businessInfo.phone} · {businessInfo.email}</p>
        </div>
        {businessInfo.heroImage && (
          <div className="hero-image" aria-label="Featured project image">
            <img src={businessInfo.heroImage.src} alt={businessInfo.heroImage.alt} />
          </div>
        )}
        <aside className="hero-card" aria-label="Business highlights">
          <span className="hero-card__number">20+</span>
          <p className="hero-card__label">Years Experience</p>
          <ul>
            <li>Residential projects</li>
            <li>Small commercial work</li>
            <li>{businessInfo.serviceArea}</li>
          </ul>
        </aside>
      </section>

      <section className="section section-wrap" id="about">
        <SectionHeader eyebrow="About" title="Local paint and remodel help for practical property improvements.">
          <p>
            {businessInfo.businessName} proudly serves homeowners and small businesses throughout the greater Hermiston area. Whether you need interior or exterior painting, updated flooring, replacement windows and doors, or a bathroom remodel, every project is approached with care, clear communication, and quality workmanship.
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
              <ProjectCard key={project.id} project={project} onSelect={setSelectedProject} />
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
            Serving Hermiston and surrounding communities with residential and small commercial painting and remodeling services. Reach out to discuss your project and see how {businessInfo.businessName} can help bring your ideas to life.
          </p>
        </SectionHeader>
      </section>

      <section className="section section-wrap contact-section" id="contact">
        <SectionHeader eyebrow="Contact" title="Ready to talk about your project?">
          <p>
            Have a project in mind? Call, text, or email {businessInfo.businessName} to discuss your painting or remodeling needs. Whether it's a small update or a larger renovation, we're happy to talk through your plans.
          </p>
        </SectionHeader>
        <div className="contact-card">
          <a className="contact-card__action" href={phoneHref}>Call: {businessInfo.phone}</a>
          <a className="contact-card__action" href={textHref}>Text: {businessInfo.phone}</a>
          <a className="contact-card__action" href={emailHref}>Email: {businessInfo.email}</a>
          <p>{businessInfo.serviceArea}</p>
        </div>
      </section>
      {selectedProject && <ProjectLightbox project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </main>
  )
}

export default App