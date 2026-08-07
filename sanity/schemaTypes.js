import { defineField, defineType } from 'sanity'

const piece = defineType({
  name: 'piece',
  title: 'Piezas',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'category', title: 'Categoría', type: 'string', options: { list: ['Tazas', 'Cuencos', 'Bandejas', 'Platos', 'Otros'] }, validation: (rule) => rule.required() }),
    defineField({ name: 'price', title: 'Precio (ARS)', type: 'number', validation: (rule) => rule.required().positive() }),
    defineField({ name: 'image', title: 'Foto de la pieza', type: 'image', options: { hotspot: true }, validation: (rule) => rule.required() }),
    defineField({ name: 'dimensions', title: 'Medidas', type: 'string', description: 'Ej.: 9 cm de alto × 8 cm de diámetro' }),
    defineField({ name: 'capacity', title: 'Capacidad', type: 'string', description: 'Ej.: 350 ml' }),
    defineField({ name: 'material', title: 'Material', type: 'string', description: 'Ej.: Gres esmaltado' }),
    defineField({ name: 'care', title: 'Cuidados', type: 'string', description: 'Ej.: Apta para microondas y lavavajillas' }),
    defineField({ name: 'productionTime', title: 'Tiempo de producción', type: 'string', description: 'Ej.: Entre 15 y 20 días hábiles' }),
    defineField({ name: 'available', title: 'Disponible para comprar', type: 'boolean', initialValue: true }),
    defineField({ name: 'featured', title: 'Mostrar en portada', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'name', subtitle: 'category', media: 'image' } },
})

const design = defineType({
  name: 'design',
  title: 'Diseños',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre del diseño', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'image', title: 'Foto del diseño', type: 'image', options: { hotspot: true }, validation: (rule) => rule.required() }),
    defineField({ name: 'completedAt', title: 'Fecha de realización', type: 'date', validation: (rule) => rule.required() }),
    defineField({ name: 'availableForPurchase', title: 'Disponible para elegir en un pedido', type: 'boolean', initialValue: true }),
  ],
  orderings: [{ title: 'Más recientes primero', name: 'completedAtDesc', by: [{ field: 'completedAt', direction: 'desc' }] }],
  preview: { select: { title: 'name', subtitle: 'completedAt', media: 'image' } },
})

export const schemaTypes = [piece, design]
