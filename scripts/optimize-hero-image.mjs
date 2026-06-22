import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const sourcePath = path.join(process.cwd(), 'src', 'assets', 'hero-background.png')
const outputDir = path.join(process.cwd(), 'public', 'images', 'hero')
const outputPath = path.join(outputDir, 'hero-background.webp')

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`
}

async function main() {
  let sourceStats

  try {
    sourceStats = await fs.stat(sourcePath)
  } catch {
    throw new Error(`Hero source image not found: ${sourcePath}`)
  }

  await fs.mkdir(outputDir, { recursive: true })

  const sourceMetadata = await sharp(sourcePath, { failOn: 'error' }).metadata()

  if (!sourceMetadata.width || !sourceMetadata.height) {
    throw new Error(`Could not read dimensions for ${sourcePath}`)
  }

  await sharp(sourcePath, { failOn: 'error' })
    .webp({ quality: 84, effort: 6 })
    .toFile(outputPath)

  const outputStats = await fs.stat(outputPath)
  const outputMetadata = await sharp(outputPath).metadata()
  const reduction = ((sourceStats.size - outputStats.size) / sourceStats.size) * 100

  console.log(`Source: ${path.relative(process.cwd(), sourcePath)}`)
  console.log(`  format: ${sourceMetadata.format}`)
  console.log(`  dimensions: ${sourceMetadata.width}x${sourceMetadata.height}`)
  console.log(`  transparency: ${sourceMetadata.hasAlpha ? 'yes' : 'no'}`)
  console.log(`  size: ${formatBytes(sourceStats.size)}`)
  console.log(`Output: ${path.relative(process.cwd(), outputPath)}`)
  console.log(`  format: ${outputMetadata.format}`)
  console.log(`  dimensions: ${outputMetadata.width}x${outputMetadata.height}`)
  console.log(`  size: ${formatBytes(outputStats.size)}`)
  console.log(`Reduction: ${reduction.toFixed(1)}%`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})