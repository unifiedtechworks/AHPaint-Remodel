const optimizedImageBasePath = '/images/projects/optimized'

function optimizedImagePath(fileName: string) {
  return `${optimizedImageBasePath}/${fileName}`
}

function createProject(input: ProjectSource): Project {
  const images = input.images.map((image, index) => ({
    src: optimizedImagePath(image.fileName),
    thumbnailSrc: optimizedImagePath(image.fileName),
    largeSrc: optimizedImagePath(image.fileName),
    srcSet: `${optimizedImagePath(image.fileName)} ${image.width}w`,
    sizes: '(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 380px',
    width: image.width,
    height: image.height,
    alt: input.imageAltText[index] ?? `${input.title} project photo in ${input.location}`,
  }))
  const galleryImages = images.map((image) => image.src)
  const coverImage = images[0]?.thumbnailSrc

  if (import.meta.env.DEV && input.imageAltText.length !== images.length) {
    console.warn(
      `[projects] ${input.title} has ${images.length} optimized images but ${input.imageAltText.length} alt text entries.`,
    )
  }

  return {
    id: input.id,
    title: input.title,
    category: input.category,
    location: input.location,
    description: input.description,
    coverImage,
    galleryImages,
    images,
    featured: input.featured,
  }
}

export interface ProjectImage {
  src: string
  thumbnailSrc: string
  largeSrc: string
  srcSet: string
  sizes: string
  width: number
  height: number
  alt: string
}

interface OptimizedProjectImageSource {
  fileName: string
  width: number
  height: number
}

interface ProjectSource {
  id: string
  title: string
  category: string
  location: string
  description: string
  images: OptimizedProjectImageSource[]
  imageAltText: string[]
  featured: boolean
}

export interface Project {
  id: string
  title: string
  category: string
  location: string
  description: string
  coverImage?: string
  galleryImages: string[]
  images: ProjectImage[]
  featured: boolean
}

const projectSources: ProjectSource[] = [
  {
    id: 'commercial-flooring',
    title: 'Commercial Flooring Installation',
    category: 'Flooring',
    location: 'Hermiston, Oregon',
    description: 'Wood-look flooring installed throughout commercial hallways, offices, and adjoining rooms in Hermiston, Oregon, creating a clean, durable, and professional finished space.',
    images: [
      { fileName: 'commercial-flooring-hermiston-01-450.webp', width: 450, height: 600 },
      { fileName: 'commercial-flooring-hermiston-02-450.webp', width: 450, height: 600 },
      { fileName: 'commercial-flooring-hermiston-03-450.webp', width: 450, height: 530 },
      { fileName: 'commercial-flooring-hermiston-04-450.webp', width: 450, height: 600 },
      { fileName: 'commercial-flooring-hermiston-05-450.webp', width: 450, height: 600 },
      { fileName: 'commercial-flooring-hermiston-06-450.webp', width: 450, height: 600 },
      { fileName: 'commercial-flooring-hermiston-07-450.webp', width: 450, height: 600 },
    ],
    imageAltText: [
      'Completed wood-look commercial flooring installation in a long hallway in Hermiston, Oregon',
      'New commercial flooring installed through an office hallway in Hermiston, Oregon',
      'Wood-look flooring installed in a commercial interior room in Hermiston, Oregon',
      'Completed flooring transitions between commercial rooms in Hermiston, Oregon',
      'Finished commercial flooring along walls and doorways in Hermiston, Oregon',
      'Wood-look flooring installed beside commercial office doorways in Hermiston, Oregon',
      'Completed commercial flooring in an adjoining room in Hermiston, Oregon',
    ],
    featured: true,
  },
  {
    id: 'bathroom-remodel',
    title: 'Residential Bathroom Remodel',
    category: 'Bathroom Remodeling',
    location: 'Hermiston, Oregon',
    description: 'Complete residential bathroom remodel in Hermiston, Oregon, including an updated vanity, flooring, tub and shower surround, fixtures, painting, and finish work.',
    images: [
      { fileName: 'residential-bathroom-remodel-hermiston-01-426.webp', width: 426, height: 566 },
      { fileName: 'residential-bathroom-remodel-hermiston-02-452.webp', width: 452, height: 600 },
      { fileName: 'residential-bathroom-remodel-hermiston-03-415.webp', width: 415, height: 551 },
      { fileName: 'residential-bathroom-remodel-hermiston-04-452.webp', width: 452, height: 600 },
      { fileName: 'residential-bathroom-remodel-hermiston-05-452.webp', width: 452, height: 600 },
      { fileName: 'residential-bathroom-remodel-hermiston-06-431.webp', width: 431, height: 572 },
    ],
    imageAltText: [
      'Completed bathroom vanity, mirror, and lighting remodel in Hermiston, Oregon',
      'Updated residential bathroom vanity and countertop in Hermiston, Oregon',
      'Finished bathtub and shower surround installation in Hermiston, Oregon',
      'Completed bathroom flooring and fixtures in Hermiston, Oregon',
      'Freshly painted residential bathroom after remodel in Hermiston, Oregon',
      'Finished residential bathroom remodel details in Hermiston, Oregon',
    ],
    featured: true,
  },
  {
    id: 'exterior-stain',
    title: 'Exterior Residential Staining',
    category: 'Exterior Painting & Staining',
    location: 'Hermiston, Oregon',
    description: 'Exterior wood siding stained in a rich dark finish on a Hermiston, Oregon home to refresh its appearance and help protect the wood surface.',
    images: [
      { fileName: 'exterior-residential-staining-hermiston-01-259.webp', width: 259, height: 412 },
      { fileName: 'exterior-residential-staining-hermiston-02-270.webp', width: 270, height: 334 },
    ],
    imageAltText: [
      'Residential wood siding finished with dark exterior stain in Hermiston, Oregon',
      'Completed exterior staining on a wood-sided home in Hermiston, Oregon',
    ],
    featured: true,
  },
  {
    id: 'pergola',
    title: 'Custom Pergola Construction and Painting',
    category: 'Exterior Carpentry',
    location: 'Hermiston, Oregon',
    description: 'Custom pergola designed, built, and painted for a residential property in Hermiston, Oregon, adding a durable and finished outdoor structure.',
    images: [
      { fileName: 'custom-pergola-hermiston-01-450.webp', width: 450, height: 334 },
      { fileName: 'custom-pergola-hermiston-02-450.webp', width: 450, height: 412 },
    ],
    imageAltText: [
      'Custom-built and painted residential pergola in Hermiston, Oregon',
      'Painted pergola beams and finished residential structure in Hermiston, Oregon',
    ],
    featured: true,
  },
  {
    id: 'residential-awning',
    title: 'Custom Residential Awning with Skylights',
    category: 'Exterior Construction',
    location: 'Hermiston, Oregon',
    description: 'Custom residential awning built from the ground up in Hermiston, Oregon, including integrated skylights and a complete finished exterior structure.',
    images: [
      { fileName: 'custom-residential-awning-hermiston-01-421.webp', width: 421, height: 483 },
      { fileName: 'custom-residential-awning-hermiston-02-450.webp', width: 450, height: 486 },
      { fileName: 'custom-residential-awning-hermiston-03-424.webp', width: 424, height: 392 },
      { fileName: 'custom-residential-awning-hermiston-04-450.webp', width: 450, height: 508 },
    ],
    imageAltText: [
      'Custom-built residential awning with integrated skylights in Hermiston, Oregon',
      'Completed exterior awning structure built for a Hermiston home',
      'Residential awning framing and skylight installation in Hermiston, Oregon',
      'Finished custom awning with translucent skylight panels in Hermiston, Oregon',
    ],
    featured: true,
  },
]

export const projects: Project[] = projectSources.map(createProject)

export const featuredProjects = projects.filter((project) => project.featured)