import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const sourceRoot = path.join(process.cwd(), 'src', 'assets', 'projects')
const outputRoot = path.join(process.cwd(), 'public', 'images', 'projects', 'optimized')

const projects = [
  { folderName: 'Commercial Flooring', slug: 'commercial-flooring-hermiston' },
  { folderName: 'exterior-residential-stain', slug: 'exterior-residential-staining-hermiston' },
  { folderName: 'Pergola', slug: 'custom-pergola-hermiston' },
  { folderName: 'residential-awning', slug: 'custom-residential-awning-hermiston' },
  { folderName: 'residential-bathroom-remodel', slug: 'residential-bathroom-remodel-hermiston' },
]

const sourceExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
const targetWidths = [640, 1200, 1920]

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`
}

async function listSourceImages(folderName) {
  const sourceDir = path.join(sourceRoot, folderName)
  const entries = await fs.readdir(sourceDir, { withFileTypes: true })

  return entries
    .filter((entry) => entry.isFile() && sourceExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => path.join(sourceDir, entry.name))
    .sort((firstPath, secondPath) => firstPath.localeCompare(secondPath))
}

async function optimizeImage(sourcePath, projectSlug, imageIndex) {
  const sourceStats = await fs.stat(sourcePath)
  const sourceImage = sharp(sourcePath, { failOn: 'error' }).rotate()
  const sourceMetadata = await sourceImage.metadata()

  if (!sourceMetadata.width || !sourceMetadata.height) {
    throw new Error(`Could not read dimensions for ${sourcePath}`)
  }

  const widths = [...new Set(targetWidths.map((width) => Math.min(width, sourceMetadata.width)).filter(Boolean))]
  const outputs = []

  for (const width of widths) {
    const suffix = String(width)
    const outputFileName = `${projectSlug}-${String(imageIndex + 1).padStart(2, '0')}-${suffix}.webp`
    const outputPath = path.join(outputRoot, outputFileName)
    const quality = width <= 640 ? 76 : width <= 1200 ? 80 : 84

    await sharp(sourcePath, { failOn: 'error' })
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toFile(outputPath)

    const outputStats = await fs.stat(outputPath)
    const outputMetadata = await sharp(outputPath).metadata()

    outputs.push({
      fileName: outputFileName,
      width: outputMetadata.width,
      height: outputMetadata.height,
      sizeBytes: outputStats.size,
    })
  }

  return {
    sourcePath,
    sourceWidth: sourceMetadata.width,
    sourceHeight: sourceMetadata.height,
    sourceSizeBytes: sourceStats.size,
    outputs,
  }
}

async function main() {
  await fs.mkdir(outputRoot, { recursive: true })

  const results = []

  for (const project of projects) {
    const sourceImages = await listSourceImages(project.folderName)

    if (sourceImages.length === 0) {
      throw new Error(`No source images found for ${project.folderName}`)
    }

    for (const [imageIndex, sourcePath] of sourceImages.entries()) {
      results.push(await optimizeImage(sourcePath, project.slug, imageIndex))
    }
  }

  const originalTotal = results.reduce((total, result) => total + result.sourceSizeBytes, 0)
  const optimizedTotal = results.reduce(
    (total, result) => total + result.outputs.reduce((outputTotal, output) => outputTotal + output.sizeBytes, 0),
    0,
  )
  const reduction = originalTotal === 0 ? 0 : ((originalTotal - optimizedTotal) / originalTotal) * 100

  for (const result of results) {
    const sourceRelativePath = path.relative(process.cwd(), result.sourcePath)
    console.log(`${sourceRelativePath} (${result.sourceWidth}x${result.sourceHeight}, ${formatBytes(result.sourceSizeBytes)})`)
    for (const output of result.outputs) {
      console.log(`  -> ${output.fileName} (${output.width}x${output.height}, ${formatBytes(output.sizeBytes)})`)
    }
  }

  console.log('')
  console.log(`Original gallery images: ${results.length}`)
  console.log(`Generated optimized files: ${results.reduce((total, result) => total + result.outputs.length, 0)}`)
  console.log(`Total original size: ${formatBytes(originalTotal)}`)
  console.log(`Total optimized size: ${formatBytes(optimizedTotal)}`)
  console.log(`Approximate reduction: ${reduction.toFixed(1)}%`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})