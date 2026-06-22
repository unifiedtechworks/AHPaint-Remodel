export interface Service {
  title: string
  description: string
}

export interface HeroImage {
  src: string
  alt: string
}

export interface BusinessInfo {
  businessName: string
  phone: string
  email: string
  serviceArea: string
  yearsInBusiness: number
  experienceLabel: string
  services: Service[]
  heroImage?: HeroImage
}

export const businessInfo: BusinessInfo = {
  businessName: 'Aaron Hansen Paint & Remodel LLC',

  // Client phone number shown on the site. Update here if it changes.
  phone: '541-571-3188',

  // Client email address shown on the site. Update here if it changes.
  email: 'ahpaintremodel@gmail.com',

  serviceArea: 'Greater Hermiston, Oregon area',
  yearsInBusiness: 20,
  experienceLabel: 'More than 20 Years of Experience',

  // Optional: add a hero image later, for example:
  // heroImage: { src: '/images/project-photo.jpg', alt: 'Completed remodel project' },

  services: [
    {
      title: 'Interior Painting',
      description: 'Freshen walls, trim, doors, cabinets, and living spaces with clean prep and careful finish work.',
    },
    {
      title: 'Exterior Painting',
      description: 'Protect and improve curb appeal with exterior painting for homes, shops, and small commercial spaces.',
    },
    {
      title: 'Remodeling',
      description: 'Practical remodel work for kitchens, living areas, offices, rentals, and everyday property improvements.',
    },
    {
      title: 'Flooring',
      description: 'Flooring updates that help rooms feel finished, durable, and ready for daily use.',
    },
    {
      title: 'Windows & Doors',
      description: 'Window and door replacement or improvement work to support comfort, function, and appearance.',
    },
    {
      title: 'Bathrooms, Tubs & Surrounds',
      description: 'Bathroom updates, tub projects, surrounds, repairs, and general remodel work handled with care.',
    },
  ],
}