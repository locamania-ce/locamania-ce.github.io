import { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './shop.css'
import './artisan.css'
import './details.css'
import './notes.css'
import './navigation.css'
import './story-image.css'
import './palette.css'
import './hero-filter.css'
import './product-lightbox.css'
import './cart-quantity.css'
import { getCatalog } from './sanity'
import portadaLocamania from './assets/portada-locamania.jpeg'
import magaliHistoria from './assets/magali-historia.png'

const fallbackProducts = [
  { id: 1, name: 'Taza Amanecer', category: 'Tazas', price: 18500, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85', tone: 'arena', tag: 'Más elegida' },
  { id: 2, name: 'Set Calma', category: 'Sets', price: 42000, image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=900&q=85', tone: 'salvia', tag: 'Nuevo' },
  { id: 3, name: 'Jarrón Bruma', category: 'Jarrones', price: 36500, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85', tone: 'rosa', tag: '' },
  { id: 4, name: 'Plato Nido', category: 'Mesa', price: 22000, image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=85', tone: 'crema', tag: '' },
  { id: 5, name: 'Cuenco Tierra', category: 'Mesa', price: 16000, image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=85', tone: 'arcilla', tag: 'Últimas piezas' },
  { id: 6, name: 'Taza Luna', category: 'Tazas', price: 19500, image: 'https://images.unsplash.com/photo-1565193298357-cd14ed3b9e5f?auto=format&fit=crop&w=900&q=85', tone: 'azul', tag: '' },
]

const fallbackDesigns = [
  { id: 'jarrones', name: 'Jarrones para un hogar nuevo', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=85' },
  { id: 'mesa', name: 'Mesa de domingo', image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=85' },
  { id: 'cuencos', name: 'Cuencos para compartir', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=85' },
]

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
// Reemplazar por el número de WhatsApp internacional, sin el signo +. Ej.: 5491123456789
const WHATSAPP_NUMBER = '5491159556263'

function BagIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8.5h14l-1 12H6l-1-12Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg> }
function ArrowIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg> }
function CloseIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg> }

function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [cart, setCart] = useState([])
  const [isCartOpen, setCartOpen] = useState(false)
  const [catalog, setCatalog] = useState({ products: fallbackProducts, designs: fallbackDesigns, latestWorks: fallbackDesigns })

  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname)
    window.addEventListener('popstate', updatePath)
    return () => window.removeEventListener('popstate', updatePath)
  }, [])

  useEffect(() => {
    getCatalog().then((content) => { if (content) setCatalog(content) }).catch(() => {})
  }, [])

  const navigate = (to) => {
    window.history.pushState({}, '', to)
    setPath(to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const addToCart = (product, design, notes) => { const normalizedNotes = notes.trim(); setCart((current) => { const existingIndex = current.findIndex((item) => item.id === product.id && item.design === design.name && item.notes === normalizedNotes); if (existingIndex === -1) return [...current, { ...product, design: design.name, isCustom: Boolean(design.isCustom), notes: normalizedNotes, quantity: 1 }]; return current.map((item, index) => index === existingIndex ? { ...item, quantity: (item.quantity || 1) + 1 } : item) }); setCartOpen(true) }
  const removeFromCart = (index) => setCart((current) => current.filter((_, i) => i !== index))
  const updateQuantity = (index, change) => setCart((current) => current.flatMap((item, itemIndex) => { if (itemIndex !== index) return item; const quantity = (item.quantity || 1) + change; return quantity > 0 ? { ...item, quantity } : [] }))

  return <>
    <Header path={path} navigate={navigate} openCart={() => setCartOpen(true)} count={cart.reduce((total, item) => total + (item.quantity || 1), 0)}/>
    {path === '/tienda' ? <StorePage addToCart={addToCart} products={catalog.products} designs={catalog.designs} /> : <Home navigate={navigate} products={catalog.products} latestWorks={catalog.latestWorks}/>} 
    <Footer navigate={navigate}/>
    <Cart cart={cart} isOpen={isCartOpen} close={() => setCartOpen(false)} remove={removeFromCart} updateQuantity={updateQuantity}/>
  </>
}

function Header({ path, navigate, openCart, count }) {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const link = (to) => (event) => { event.preventDefault(); setMenuOpen(false); navigate(to) }
  const whatsappLink = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : '#'
  return <header className="header">
    <a className="brand" href="/" onClick={link('/')} aria-label="Locamanía, inicio">Locamanía<span>hecho con amor</span></a>
    <button className="menu-button" onClick={() => setMenuOpen(!isMenuOpen)} aria-label="Abrir menú">☰</button>
    <nav className={isMenuOpen ? 'open' : ''}>
      <a className={path === '/tienda' ? 'current' : ''} href="/tienda" onClick={link('/tienda')}>Tienda</a>
      <a href="/#trabajos" onClick={() => setMenuOpen(false)}>Últimos diseños</a>
      <a href="/#historia" onClick={() => setMenuOpen(false)}>Nuestra historia</a>
      <a href={whatsappLink} target={WHATSAPP_NUMBER ? '_blank' : undefined} rel={WHATSAPP_NUMBER ? 'noreferrer' : undefined} onClick={(event) => { setMenuOpen(false); if (!WHATSAPP_NUMBER) event.preventDefault() }}>Contacto</a>
    </nav>
    <button className="cart-button" onClick={openCart} aria-label="Abrir carrito"><BagIcon/><span>Bolsa</span><b>{count}</b></button>
  </header>
}

function Home({ navigate, products, latestWorks }) {
  const featuredProducts = products.filter((product) => product.featured)
  const homeProducts = featuredProducts.length ? featuredProducts : products
  return <main id="inicio">
    <section className="hero"><div className="hero-copy"><p className="eyebrow">PIEZAS ÚNICAS, HECHAS A MANO</p><h1>Objetos que<br/><em>acompañan</em><br/>tus rituales.</h1><p className="hero-description">Cerámica artesanal creada lentamente para habitar tus momentos cotidianos.</p><button className="button primary" onClick={() => navigate('/tienda')}>Ver tienda <ArrowIcon/></button></div><div className="hero-visual"><div className="hero-shape"></div><img src={portadaLocamania} alt="Cartel de Locamanía junto a piezas de cerámica"/><span className="hero-note">hecho a<br/>mano</span></div></section>
    <section className="values" aria-label="Valores de Locamanía"><div><span>01</span><p>Modeladas a mano,<br/>una por una</p></div><div><span>02</span><p>Materiales nobles<br/>y duraderos</p></div><div><span>03</span><p>Pequeñas partidas,<br/>sin producción masiva</p></div></section>
    <section className="shop shop-preview"><div className="section-heading"><div><p className="eyebrow">LA TIENDA</p><h2>Piezas para todos los días.</h2></div><button className="text-link" onClick={() => navigate('/tienda')}>Ir a la tienda <ArrowIcon/></button></div><div className="product-grid">{homeProducts.slice(0, 3).map((product) => <ProductCard product={product} key={product.id} onChoose={() => navigate('/tienda')}/>)}</div></section>
    <section id="trabajos" className="works"><div className="section-heading"><div><p className="eyebrow">HECHO A MEDIDA</p><h2>Últimos diseños.</h2></div></div><div className="works-grid">{latestWorks.map((work) => <img key={work.id} src={work.image} alt="Trabajo de cerámica realizado por Locamanía"/>)}</div></section>
    <section id="historia" className="story"><div className="story-photo"><img src={magaliHistoria} alt="Magali junto a sus piezas de cerámica en una feria"/></div><div className="story-copy"><p className="eyebrow">DEL BARRO A TU CASA</p><h2>Hechas para ser usadas, queridas y recordadas.</h2><p>Detrás de Locamanía estoy yo, Magali. Cada pieza nace de mis manos, entre pruebas, colores, pinceles y muchas ganas de crear objetos que acompañen momentos cotidianos.</p><p>Trabajo en pequeñas partidas, cuidando cada detalle y aceptando las marcas únicas que deja el proceso. Porque para mí, la cerámica no busca ser perfecta: busca contar una historia y encontrar un lugar en tu casa.</p></div></section>
  </main>
}

function StorePage({ addToCart, products, designs }) {
  const [category, setCategory] = useState('Todo')
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [notes, setNotes] = useState('')
  const categories = ['Todo', ...new Set(products.map((p) => p.category))]
  const filtered = useMemo(() => category === 'Todo' ? products : products.filter((p) => p.category === category), [category])
  const choosePiece = (product) => { setSelectedPiece(product); setSelectedDesign(null); setNotes(''); window.setTimeout(() => document.querySelector('#elegir-diseno')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0) }
  const confirm = () => { if (selectedPiece && selectedDesign) { addToCart(selectedPiece, selectedDesign, notes); setSelectedPiece(null); setSelectedDesign(null); setNotes('') } }

  return <main className="store-page"><section className="store-hero"><p className="eyebrow">TIENDA LOCOMANÍA</p><h1>Elegí una pieza<br/><em>hecha para vos.</em></h1><p>Primero seleccioná la pieza. Después elegí uno de nuestros diseños o pedí uno personalizado.</p><p className="handmade-note">Cada pieza se realiza por encargo. Al ser hecha a mano, puede presentar pequeñas variaciones que la hacen única.</p></section><section className="shop store-shop"><div className="filters" aria-label="Filtrar productos">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="product-grid">{filtered.map((product) => <ProductCard product={product} key={product.id} onChoose={() => choosePiece(product)} chooseLabel="Elegir pieza" allowPreview/>)}</div></section>{selectedPiece && <section id="elegir-diseno" className="design-picker"><div className="picker-heading"><div><p className="eyebrow">PASO 2 DE 2</p><h2>Elegí el diseño para<br/><em>{selectedPiece.name}.</em></h2></div><button onClick={() => setSelectedPiece(null)} className="cancel-selection">Cambiar pieza</button></div><div className="picker-grid">{designs.map((design) => <button className={`design-option ${selectedDesign?.id === design.id ? 'selected' : ''}`} key={design.id} onClick={() => setSelectedDesign(design)} aria-pressed={selectedDesign?.id === design.id}><img src={design.image} alt={`Elegir diseño ${design.name}`}/><span>{design.name}</span></button>)}<button className={`custom-option ${selectedDesign?.id === 'personalizado' ? 'selected' : ''}`} onClick={() => setSelectedDesign({ id: 'personalizado', name: 'Diseño personalizado', isCustom: true })}><span>+</span><strong>Crear un diseño personalizado</strong><p>Contanos tu idea al realizar el pedido.</p></button></div><label className="design-notes"><span>Detalles para esta pieza <em>(opcional)</em></span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ej.: fondo crema, flores azules, incluir el nombre Lucía..." rows="4"/></label><div className="selection-bar"><div><span>Pieza</span><strong>{selectedPiece.name}</strong></div><div><span>Diseño</span><strong>{selectedDesign?.name || 'Elegí una opción'}</strong></div><button className="button primary" onClick={confirm} disabled={!selectedDesign}>Agregar a la bolsa <ArrowIcon/></button></div></section>}</main>
}

function ProductImage({ product, allowPreview }) { const [isPreviewOpen, setPreviewOpen] = useState(false); if (!allowPreview) return <img src={product.image} alt={product.name}/>; return <><button className="image-preview-trigger" onClick={() => setPreviewOpen(true)} aria-label={`Ver foto ampliada de ${product.name}`}><img src={product.image} alt={product.name}/></button>{isPreviewOpen && <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={`Foto ampliada de ${product.name}`}><button className="image-lightbox-backdrop" onClick={() => setPreviewOpen(false)} aria-label="Cerrar foto ampliada"/><div className="image-lightbox-content"><img src={product.image} alt={product.name}/></div></div>}</> }

function ProductCard({ product, onChoose, chooseLabel = 'Ver pieza', allowPreview = false }) { const [isOpen, setOpen] = useState(false); return <article className="product"><div className={`product-image ${product.tone}`}><ProductImage product={product} allowPreview={allowPreview}/>{product.tag && <span>{product.tag}</span>}<button onClick={onChoose} aria-label={`${chooseLabel}: ${product.name}`}>+</button></div><div className="product-info"><div><h3>{product.name}</h3><p>{product.category}</p></div><strong>{money.format(product.price)}</strong></div><button className="details-button" onClick={() => setOpen(!isOpen)} aria-expanded={isOpen}>{isOpen ? 'Ocultar detalles' : 'Detalles'} <span>{isOpen ? '−' : '+'}</span></button>{isOpen && <div className="piece-details"><div><span>Medidas</span><p>{product.dimensions || 'A confirmar'}</p></div><div><span>Capacidad</span><p>{product.capacity || 'A confirmar'}</p></div></div>}</article> }

function Cart({ cart, isOpen, close, remove, updateQuantity }) {
  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  const hasCustomDesign = cart.some((item) => item.isCustom)
  const orderMessage = [
    'Hola, quiero realizar el siguiente pedido en Locamanía:',
    '',
    ...cart.map((item, index) => [
      `${index + 1}. ${item.quantity || 1} × ${item.name}`,
      `   Diseño: ${item.design || 'Sin diseño seleccionado'}`,
      item.notes ? `   Detalles: ${item.notes}` : '',
      `   ${item.isCustom ? 'Precio por pieza' : 'Precio por unidad'}: ${money.format(item.price)}`,
      `   Subtotal: ${money.format(item.price * (item.quantity || 1))}`,
      item.isCustom ? '   Personalización: monto a definir' : '',
    ].filter(Boolean).join('\n')),
    '',
    `Total base del pedido: ${money.format(total)}`,
    hasCustomDesign ? `Total final: ${money.format(total)} + monto por personalización a confirmar` : `Total final: ${money.format(total)}`,
    '',
    'Gracias.',
  ].join('\n')
  const sendOrder = () => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`, '_blank', 'noopener,noreferrer')

  return <><aside className={`cart-panel ${isOpen ? 'visible' : ''}`} aria-hidden={!isOpen}><div className="cart-header"><h2>Tu bolsa <span>({cart.reduce((sum, item) => sum + (item.quantity || 1), 0)})</span></h2><button onClick={close} aria-label="Cerrar carrito"><CloseIcon/></button></div>{cart.length === 0 ? <div className="empty-cart"><BagIcon/><p>Tu bolsa está vacía.</p></div> : <><div className="cart-items">{cart.map((item, index) => <div className="cart-item" key={`${item.id}-${index}`}><img src={item.image} alt=""/><div><h3>{item.name}</h3><small>Diseño: {item.design}</small>{item.notes && <small>Detalles: {item.notes}</small>}<p>{item.isCustom ? 'Precio por pieza: ' : 'Precio por unidad: '}{money.format(item.price)}</p><div className="quantity-control" aria-label={`Cantidad de ${item.name}`}><button onClick={() => updateQuantity(index, -1)} aria-label={`Quitar una unidad de ${item.name}`}>−</button><span>{item.quantity || 1}</span><button onClick={() => updateQuantity(index, 1)} aria-label={`Agregar una unidad de ${item.name}`}>+</button></div><strong className="item-subtotal">Subtotal: {money.format(item.price * (item.quantity || 1))}</strong>{item.isCustom && <small>Personalización: monto a definir</small>}<button onClick={() => remove(index)}>Quitar</button></div></div>)}</div><div className="cart-total"><div><span>Subtotal de piezas</span><strong>{money.format(total)}</strong></div>{hasCustomDesign && <div><span>Personalización</span><strong>Monto a definir</strong></div>}<p>{hasCustomDesign ? `Total final: ${money.format(total)} + monto por personalización` : `Total final: ${money.format(total)}`}</p><button className="button primary" onClick={sendOrder}>Enviar pedido por WhatsApp <ArrowIcon/></button></div></>}</aside>{isOpen && <button className="backdrop" onClick={close} aria-label="Cerrar carrito"/>}</>
}

function Footer({ navigate }) { return <footer><a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate('/') }}>Locamanía<span>hecho con amor</span></a><p>© 2026 · Hecho con amor en Argentina</p><div><a href="https://www.instagram.com/locamania.ce/" target="_blank" rel="noreferrer">Instagram</a></div></footer> }

createRoot(document.getElementById('root')).render(<App />)
