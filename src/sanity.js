import { createClient } from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

const client = projectId
  ? createClient({ projectId, dataset, apiVersion: '2026-08-07', useCdn: true })
  : null

const imageUrl = (image) => image?.asset?.url || ''

export async function getCatalog() {
  if (!client) return null

  const [pieces, designs, latestWorks] = await Promise.all([
    client.fetch(`*[_type == "piece" && available == true] | order(name asc) { _id, name, category, price, dimensions, capacity, material, care, productionTime, "image": image.asset->url }`),
    client.fetch(`*[_type == "design" && availableForPurchase == true] | order(completedAt desc) { _id, name, "image": image.asset->url }`),
    client.fetch(`*[_type == "design"] | order(completedAt desc)[0...3] { _id, name, "image": image.asset->url }`),
  ])

  if (!pieces.length && !designs.length && !latestWorks.length) return null

  return {
    products: pieces.map((piece) => ({ id: piece._id, ...piece, image: imageUrl({ asset: { url: piece.image } }), tone: 'arena', tag: '' })),
    designs: designs.map((design) => ({ id: design._id, ...design, image: imageUrl({ asset: { url: design.image } }) })),
    latestWorks: latestWorks.map((work) => ({ id: work._id, ...work, image: imageUrl({ asset: { url: work.image } }) })),
  }
}
