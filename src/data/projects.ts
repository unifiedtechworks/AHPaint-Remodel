const projectImageModules = import.meta.glob('../assets/projects/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

function folderImages(folderName: string) {
  const folderPrefix = `../assets/projects/${folderName}/`

  return Object.entries(projectImageModules)
    .filter(([path]) => path.startsWith(folderPrefix))
    .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
    .map(([, imageUrl]) => imageUrl)
}

function createProject(input: ProjectSource): Project {
  const galleryImages = folderImages(input.folderName)
  const coverImage = galleryImages[0]

  if (import.meta.env.DEV && galleryImages.length > 1 && !coverImage) {
    console.warn(`[projects] ${input.title} has multiple images in ${input.folderName}, but no cover image was resolved.`)
  }

  if (import.meta.env.DEV && galleryImages.length <= 1) {
    const rawFolderImageCount = Object.keys(projectImageModules).filter((path) =>
      path.startsWith(`../assets/projects/${input.folderName}/`),
    ).length

    if (rawFolderImageCount > galleryImages.length) {
      console.warn(
        `[projects] ${input.title} folder contains ${rawFolderImageCount} image files, but only ${galleryImages.length} resolved into the gallery.`,
      )
    }
  }

  return {
    id: input.id,
    title: input.title,
    category: input.category,
    description: input.description,
    coverImage,
    galleryImages,
    featured: input.featured,
  }
}

interface ProjectSource {
  id: string
  title: string
  category: string
  description: string
  folderName: string
  featured: boolean
}

export interface Project {
  id: string
  title: string
  category: string
  description: string
  coverImage?: string
  galleryImages: string[]
  featured: boolean
}

const projectSources: ProjectSource[] = [
  {
    id: 'commercial-flooring',
    title: 'Commercial Flooring',
    category: 'Flooring',
    description: 'Durable flooring work completed for a local commercial space.',
    folderName: 'Commercial Flooring',
    featured: true,
  },
  {
    id: 'bathroom-remodel',
    title: 'Bathroom Remodel',
    category: 'Bathroom Remodel',
    description: 'Updated bathroom finish work with clean, practical details.',
    folderName: 'residential-bathroom-remodel',
    featured: true,
  },
  {
    id: 'exterior-stain',
    title: 'Exterior Residential Stain',
    category: 'Exterior Painting',
    description: 'Exterior stain work to refresh and protect residential surfaces.',
    folderName: 'exterior-residential-stain',
    featured: true,
  },
  {
    id: 'pergola',
    title: 'Pergola Project',
    category: 'Outdoor Finish Work',
    description: 'Outdoor structure improvements with a clean finished appearance.',
    folderName: 'Pergola',
    featured: true,
  },
  {
    id: 'residential-awning',
    title: 'Residential Awning',
    category: 'Exterior Remodel',
    description: 'Residential exterior improvement work built for everyday use.',
    folderName: 'residential-awning',
    featured: true,
  },
]

export const projects: Project[] = projectSources.map(createProject)

export const featuredProjects = projects.filter((project) => project.featured)