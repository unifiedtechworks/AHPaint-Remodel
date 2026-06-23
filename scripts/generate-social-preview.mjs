import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const width = 1200
const height = 630
const sourcePath = path.join(process.cwd(), 'public', 'images', 'hero', 'hero-background.webp')
const outputPath = path.join(process.cwd(), 'public', 'social-preview.jpg')
const outputDirectory = path.dirname(outputPath)

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function textOverlaySvg() {
  const businessNameLineOne = escapeXml('Aaron Hansen')
  const businessNameLineTwo = escapeXml('Paint & Remodel LLC')
  const serviceLineOne = escapeXml('General Contractor')
  const serviceLineTwo = escapeXml('in Hermiston, Oregon')
  const supportingLine = escapeXml('Residential & Small Commercial')

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="panel" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#101114" stop-opacity="0.94" />
      <stop offset="1" stop-color="#050506" stop-opacity="0.82" />
    </linearGradient>
    <linearGradient id="accent" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#f2f4f5" stop-opacity="0.95" />
      <stop offset="1" stop-color="#8e969d" stop-opacity="0.72" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="rgba(3, 3, 4, 0.48)" />
  <rect x="70" y="55" width="720" height="520" rx="34" fill="url(#panel)" stroke="rgba(225, 228, 231, 0.18)" stroke-width="2" />
  <rect x="112" y="112" width="116" height="7" rx="3.5" fill="url(#accent)" />
  <text x="112" y="213" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="800" letter-spacing="-1.6">
    <tspan x="112" dy="0">${businessNameLineOne}</tspan>
    <tspan x="112" dy="74">${businessNameLineTwo}</tspan>
  </text>
  <text x="112" y="376" fill="#d9dde1" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700" letter-spacing="-0.4">
    <tspan x="112" dy="0">${serviceLineOne}</tspan>
    <tspan x="112" dy="48">${serviceLineTwo}</tspan>
  </text>
  <text x="112" y="504" fill="#aeb4ba" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" letter-spacing="1.1">
    <tspan x="112" dy="0">${supportingLine}</tspan>
  </text>
</svg>`
}

async function main() {
  try {
    await fs.access(sourcePath)
  } catch {
    throw new Error(`Required source asset not found: ${sourcePath}`)
  }

  const sourceStats = await fs.stat(sourcePath)
  const sourceMetadata = await sharp(sourcePath, { failOn: 'error' }).metadata()
  await fs.mkdir(outputDirectory, { recursive: true })

  const background = await sharp(sourcePath, { failOn: 'error' })
    .resize(width, height, { fit: 'cover', position: 'right' })
    .modulate({ brightness: 0.68, saturation: 0.82 })
    .toBuffer()

  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: '#050506',
    },
  })
    .composite([
      { input: background, blend: 'over' },
      { input: Buffer.from(textOverlaySvg()), blend: 'over' },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(outputPath)

  const outputStats = await fs.stat(outputPath)
  const outputMetadata = await sharp(outputPath).metadata()

  console.log(`Source asset: ${path.relative(process.cwd(), sourcePath)}`)
  console.log(`  dimensions: ${sourceMetadata.width}x${sourceMetadata.height}`)
  console.log(`  size: ${formatBytes(sourceStats.size)}`)
  console.log(`Output: ${path.relative(process.cwd(), outputPath)}`)
  console.log(`  format: ${outputMetadata.format}`)
  console.log(`  dimensions: ${outputMetadata.width}x${outputMetadata.height}`)
  console.log(`  size: ${formatBytes(outputStats.size)}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})