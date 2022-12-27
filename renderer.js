const loadImage = src => {
  const img = new Image()
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

let isDarkMode = false

const toggleTheme = () => {
  if (isDarkMode) {
    document.querySelector('html').classList.remove('dark')
    isDarkMode = false
    return
  }
  document.querySelector('html').classList.add('dark')
  isDarkMode = true
}

window.onload = () => {
  const canvas = document.querySelector('#canvas')
  const ctx = canvas.getContext('2d')
  const btn = document.querySelector('#switcher')
  btn.addEventListener('click', ({ clientX, clientY }) => {
    window.APP.capturePage()
      .then(loadImage)
      .then(img => {
        spread(img, { x: clientX, y: clientY, reverse: isDarkMode })
        toggleTheme()
      })
  })

  const calcLength = (x0, y0, x1, y1) => {
    return Math.sqrt((y1 - y0) ** 2 + (x1 - x0) ** 2)
  }

  const getMaxRadius = (x, y) => {
    const { width, height } = canvas
    return Math.max(
      calcLength(0, 0, x, y),
      calcLength(width, 0, x, y),
      calcLength(width, height, x, y),
      calcLength(0, height, x, y),
    )
  }

  const spread = (img, { x, y, reverse }) => {
    return new Promise(resolve => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w
      canvas.height = h
      canvas.style.display = 'block'
      const radius = Math.ceil(getMaxRadius(x, y))
      const now = performance.now()
      const DURATION = 400
      const raf = () => {
        const percentage = (performance.now() - now) / DURATION
        // const percentage = 0.5
        const r = radius * (reverse ? 1 - percentage : percentage)
        ctx.clearRect(0, 0, w, h)
        ctx.save()
        ctx.beginPath()
        ctx.arc(x, y, r >= 0 ? r : 0, 0, 2 * Math.PI, !reverse)
        if (!reverse) {
          ctx.rect(0, 0, w, h)
        }
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h)
        ctx.restore()
        if (percentage >= 1) {
          canvas.style.display = 'none'
          return resolve()
        }
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    })
  }
}