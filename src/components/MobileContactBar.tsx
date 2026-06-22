import { businessInfo } from '../data/business'

function PhoneIcon() {
  return (
    <svg className="mobile-contact-bar__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2a1.1 1.1 0 0 1 1.13-.26c1.24.41 2.53.62 3.86.62.61 0 1.1.49 1.1 1.1v3.49c0 .61-.49 1.1-1.1 1.1C10.64 21.23 2.77 13.36 2.77 3.6c0-.61.49-1.1 1.1-1.1h3.5c.61 0 1.1.49 1.1 1.1 0 1.33.21 2.62.62 3.86.12.39.03.81-.27 1.12l-2.2 2.21Z"
        fill="currentColor"
      />
    </svg>
  )
}

function MessageIcon() {
  return (
    <svg className="mobile-contact-bar__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M4.25 4.5h15.5c1.1 0 2 .9 2 2v10.25c0 1.1-.9 2-2 2H8.3l-4.05 2.7v-2.7c-1.1 0-2-.9-2-2V6.5c0-1.1.9-2 2-2Zm1.1 4.15 6.65 4.28 6.65-4.28-.82-1.27L12 11.13 6.17 7.38l-.82 1.27Z"
        fill="currentColor"
      />
    </svg>
  )
}

function MobileContactBar() {
  const callHref = `tel:${businessInfo.phone}`
  const textHref = `sms:${businessInfo.phone}`

  return (
    <nav className="mobile-contact-bar" aria-label="Quick contact actions">
      <a className="mobile-contact-bar__button" href={callHref} aria-label={`Call Aaron at ${businessInfo.phone}`}>
        <PhoneIcon />
        <span>Call Aaron</span>
      </a>
      <a className="mobile-contact-bar__button" href={textHref} aria-label={`Text Aaron at ${businessInfo.phone}`}>
        <MessageIcon />
        <span>Text Aaron</span>
      </a>
    </nav>
  )
}

export default MobileContactBar