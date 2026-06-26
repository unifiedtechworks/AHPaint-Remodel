import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const background = '#050506'
const sourcePath = path.join(process.cwd(), 'public', 'branding', 'favicon-source.png')
const outputDirectory = path.join(process.cwd(), 'public')

const outputs = [
  { fileName: 'favicon-16x16.png', width: 16, height: 16, sharpen: { sigma: 0.45, m1: 0.55, m2: 0.9 } },
  { fileName: 'favicon-32x32.png', width: 32, height: 32, sharpen: { sigma: 0.35, m1: 0.45, m2: 0.75 } },
  { fileName: 'apple-touch-icon.png', width: 180, height: 180 },
  { fileName: 'android-chrome-192x192.png', width: 192, height: 192 },
  { fileName: 'android-chrome-512x512.png', width: 512, height: 512 },
]

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`
}

function relativePath(filePath) {
  return path.relative(process.cwd(), filePath)
}

async function main() {
  let sourceStats

  try {
    sourceStats = await fs.stat(sourcePath)
  } catch {
    throw new Error(`Favicon source image not found: ${sourcePath}`)
  }

  const sourceMetadata = await sharp(sourcePath, { failOn: 'error' }).metadata()

  if (!sourceMetadata.width || !sourceMetadata.height) {
    throw new Error(`Could not read dimensions for ${sourcePath}`)
  }

  await fs.mkdir(outputDirectory, { recursive: true })

  console.log(`Source: ${relativePath(sourcePath)}`)
  console.log(`  format: ${sourceMetadata.format}`)
  console.log(`  dimensions: ${sourceMetadata.width}x${sourceMetadata.height}`)
  console.log(`  transparency: ${sourceMetadata.hasAlpha ? 'yes' : 'no'}`)
  console.log(`  size: ${formatBytes(sourceStats.size)}`)

  for (const output of outputs) {
    const outputPath = path.join(outputDirectory, output.fileName)
    let pipeline = sharp(sourcePath, { failOn: 'error' })
      .resize(output.width, output.height, {
        fit: 'contain',
        position: 'center',
        background,
        kernel: sharp.kernel.lanczos3,
      })
      .flatten({ background })

    if (output.sharpen) {
      pipeline = pipeline.sharpen(output.sharpen)
    }

    await pipeline
      .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
      .toFile(outputPath)

    const outputStats = await fs.stat(outputPath)
    const outputMetadata = await sharp(outputPath, { failOn: 'error' }).metadata()

    console.log(`Output: ${relativePath(outputPath)}`)
    console.log(`  dimensions: ${outputMetadata.width}x${outputMetadata.height}`)
    console.log(`  size: ${formatBytes(outputStats.size)}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})