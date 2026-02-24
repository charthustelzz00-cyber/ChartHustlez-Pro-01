"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

const MATRIX_CHARS =
  "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン$%&@#*+=<>{}[]|^~"
const SNOW_CHARS = ["\u2744", "\u2746", "\u2745", "\u00B7", "\u2022", "*"]
const THEMES = ["green", "cyan", "magenta", "amber", "red"] as const
const PORTAL_DURATION = 4000

interface SnowFlake {
  el: HTMLSpanElement
  x: number
  y: number
  speed: number
  drift: number
  wobbleSpeed?: number
  wobbleAmp?: number
  time?: number
}

export function LandingClient() {
  const [phase, setPhase] = useState<"portal" | "fadeout" | "landing">("portal")
  const [progress, setProgress] = useState(0)
  const [theme, setTheme] = useState("green")
  const [drawerOpen, setDrawerOpen] = useState(false)

  const portalCanvasRef = useRef<HTMLCanvasElement>(null)
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null)
  const portalSnowRef = useRef<HTMLDivElement>(null)
  const snowflakesRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const statusMessages = [
    "Initializing",
    "Decrypting",
    "Loading matrix",
    "Syncing data",
    "Establishing link",
    "Entering",
  ]

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("charthustlez-theme")
    if (saved && THEMES.includes(saved as (typeof THEMES)[number])) {
      setTheme(saved)
    }
  }, [])

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute("data-theme", theme)
  }, [theme])

  // Portal matrix rain
  useEffect(() => {
    if (phase !== "portal") return
    const canvas = portalCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops = Array(columns)
      .fill(0)
      .map(() => Math.random() * -50)

    const interval = setInterval(() => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const primaryColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--primary")
          .trim() || "#00ff00"
      ctx.font = fontSize + "px monospace"

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        ctx.fillStyle = "#fff"
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)
        ctx.fillStyle = primaryColor
        ctx.globalAlpha = 0.7
        ctx.fillText(char, i * fontSize, (drops[i] - 1) * fontSize)
        ctx.globalAlpha = 1

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += 0.5 + Math.random() * 0.5
      }
    }, 40)

    return () => clearInterval(interval)
  }, [phase])

  // Portal snowflakes
  useEffect(() => {
    if (phase !== "portal") return
    const container = portalSnowRef.current
    if (!container) return

    const flakes: SnowFlake[] = []
    for (let i = 0; i < 30; i++) {
      const flake = document.createElement("span")
      flake.className = "portal-snowflake"
      flake.textContent = SNOW_CHARS[Math.floor(Math.random() * SNOW_CHARS.length)]
      const size = Math.random() * 10 + 8
      flake.style.fontSize = size + "px"
      flake.style.left = Math.random() * 100 + "%"
      flake.style.bottom = "-5%"
      flake.style.opacity = String(Math.random() * 0.5 + 0.3)
      container.appendChild(flake)
      flakes.push({
        el: flake,
        x: Math.random() * 100,
        y: 100 + Math.random() * 20,
        speed: Math.random() * 0.6 + 0.2,
        drift: Math.random() * 0.3 - 0.15,
      })
    }

    let animId: number
    function animate() {
      flakes.forEach((f) => {
        f.y -= f.speed * 0.4
        f.x += f.drift * 0.3
        if (f.y < -5) {
          f.y = 105
          f.x = Math.random() * 100
        }
        if (f.x > 100) f.x = 0
        if (f.x < 0) f.x = 100
        f.el.style.bottom = 100 - f.y + "%"
        f.el.style.left = f.x + "%"
      })
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      flakes.forEach((f) => f.el.remove())
    }
  }, [phase])

  // Portal progress + auto-transition
  useEffect(() => {
    if (phase !== "portal") return

    let prog = 0
    const progressInterval = setInterval(() => {
      prog += 1.2
      if (prog > 100) prog = 100
      setProgress(prog)
    }, PORTAL_DURATION / 100)

    const timeout = setTimeout(() => {
      clearInterval(progressInterval)
      setPhase("fadeout")
      setTimeout(() => setPhase("landing"), 1200)
    }, PORTAL_DURATION)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(timeout)
    }
  }, [phase])

  // Landing page matrix rain
  useEffect(() => {
    if (phase !== "landing") return
    const canvas = matrixCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const fontSize = 16
    let columns = Math.floor(canvas.width / fontSize)
    let drops = Array(columns)
      .fill(0)
      .map(() => Math.random() * (-canvas.height / fontSize))

    const resizeHandler = () => {
      columns = Math.floor(canvas!.width / fontSize)
      drops = Array(columns)
        .fill(0)
        .map(() => Math.random() * (-canvas!.height / fontSize))
    }
    window.addEventListener("resize", resizeHandler)

    let animId: number
    function draw() {
      ctx!.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      const color =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--primary")
          .trim() || "#00ff00"
      ctx!.font = fontSize + "px monospace"

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx!.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx!.fillText(char, x, y)

        ctx!.fillStyle = color
        ctx!.globalAlpha = 0.6
        const trailChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        ctx!.fillText(trailChar, x, y - fontSize)
        ctx!.globalAlpha = 0.3
        ctx!.fillText(trailChar, x, y - fontSize * 2)
        ctx!.globalAlpha = 1

        if (y > canvas!.height && Math.random() > 0.98) {
          drops[i] = Math.random() * -10
        }
        drops[i] += 0.4 + Math.random() * 0.3
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("resize", resizeHandler)
    }
  }, [phase])

  // Landing page snowflakes
  useEffect(() => {
    if (phase !== "landing") return
    const container = snowflakesRef.current
    if (!container) return

    const snowCount = window.innerWidth < 768 ? 50 : 80
    const flakes: SnowFlake[] = []

    for (let i = 0; i < snowCount; i++) {
      const flake = document.createElement("span")
      flake.className = "snowflake"
      flake.textContent = SNOW_CHARS[Math.floor(Math.random() * SNOW_CHARS.length)]
      const size = Math.random() * 12 + 8
      flake.style.fontSize = size + "px"
      flake.style.opacity = String(Math.random() * 0.5 + 0.3)
      flake.style.left = Math.random() * 100 + "%"
      flake.style.bottom = "-5%"
      container.appendChild(flake)
      flakes.push({
        el: flake,
        x: Math.random() * 100,
        y: Math.random() * 120,
        speed: Math.random() * 0.8 + 0.2,
        drift: Math.random() * 0.5 - 0.25,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        wobbleAmp: Math.random() * 1.5 + 0.5,
        time: Math.random() * 100,
      })
    }

    let animId: number
    function animate() {
      flakes.forEach((f) => {
        f.y -= f.speed * 0.25
        f.time! += f.wobbleSpeed!
        f.x += Math.sin(f.time!) * f.wobbleAmp! * 0.05 + f.drift * 0.1

        if (f.y < -10) {
          f.y = 110
          f.x = Math.random() * 100
          f.el.textContent = SNOW_CHARS[Math.floor(Math.random() * SNOW_CHARS.length)]
        }
        if (f.x > 102) f.x = -2
        if (f.x < -2) f.x = 102

        f.el.style.bottom = 100 - f.y + "%"
        f.el.style.left = f.x + "%"
      })
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      flakes.forEach((f) => f.el.remove())
    }
  }, [phase])

  // Keyboard shortcut T for theme cycling
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        (e.key === "t" || e.key === "T") &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        setTheme((prev) => {
          const idx = THEMES.indexOf(prev as (typeof THEMES)[number])
          const next = THEMES[(idx + 1) % THEMES.length]
          localStorage.setItem("charthustlez-theme", next)
          return next
        })
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const handleThemeChange = useCallback((t: string) => {
    setTheme(t)
    localStorage.setItem("charthustlez-theme", t)
    setDrawerOpen(false)
  }, [])

  const msgIndex = Math.min(Math.floor(progress / 20), statusMessages.length - 1)
  const loadingText =
    progress < 100
      ? `${statusMessages[msgIndex]}... ${Math.floor(progress)}%`
      : "Entering..."

  // Close drawer on outside click
  useEffect(() => {
    const handler = () => setDrawerOpen(false)
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [])

  return (
    <>
      {/* Loading Portal */}
      {(phase === "portal" || phase === "fadeout") && (
        <div
          className={`loading-portal ${phase === "fadeout" ? "fade-out" : ""}`}
        >
          <canvas ref={portalCanvasRef} className="portal-matrix-canvas" />
          <div ref={portalSnowRef} className="portal-snowflakes" />
          <div
            className={`portal-content ${phase === "portal" ? "visible" : ""}`}
            style={{ animationDelay: "0.2s" }}
          >
            <div
              className={`portal-ring ${progress > 30 ? "expanded" : ""}`}
            >
              <div className="portal-inner">
                <h1 className="portal-title">CHARTHUSTLEZ</h1>
                <p className="portal-domain">.online</p>
                <p className="portal-subtitle">{loadingText}</p>
                <div className="loading-bar-container">
                  <div
                    className="loading-bar"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Landing Page */}
      {phase === "landing" && (
        <div className="landing-page">
          <canvas ref={matrixCanvasRef} className="matrix-canvas" />
          <div ref={snowflakesRef} className="snowflakes-container" />

          {/* Theme Toggle */}
          <div
            className="theme-toggle"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="theme-cycle-btn"
              onClick={(e) => {
                e.stopPropagation()
                setDrawerOpen((o) => !o)
              }}
              title="Cycle Theme"
              aria-label="Toggle theme selector"
            >
              <span className="theme-icon" />
              <span className="theme-label">{theme.toUpperCase()}</span>
            </button>
            <div className={`theme-drawer ${drawerOpen ? "open" : ""}`}>
              {THEMES.map((t) => (
                <button
                  key={t}
                  className={`theme-btn ${theme === t ? "active" : ""}`}
                  onClick={() => handleThemeChange(t)}
                >
                  <span
                    className="theme-dot"
                    style={{
                      background:
                        t === "green"
                          ? "#00ff00"
                          : t === "cyan"
                            ? "#00ffff"
                            : t === "magenta"
                              ? "#ff00ff"
                              : t === "amber"
                                ? "#ffbf00"
                                : "#ff0040",
                    }}
                  />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Top Marquee */}
          <div className="marquee-container">
            <div className="marquee">
              <span>
                {"CHARTHUSTLEZ.ONLINE \u2022 LAUNCHING \u2022 ".repeat(4)}
              </span>
              <span>
                {"CHARTHUSTLEZ.ONLINE \u2022 LAUNCHING \u2022 ".repeat(4)}
              </span>
            </div>
          </div>

          {/* Hero Section */}
          <div className="hero-section">
            <h1 className="hero-title glitch" data-text="ChartHustlez">
              ChartHustlez
            </h1>
            <p className="hero-domain">.online</p>
            <p className="hero-tagline">From Beginner to Builder</p>
            <button
              className="cta-button"
              onClick={() => router.push("/signup")}
            >
              Join the Launch
            </button>
          </div>

          {/* Bottom Marquee */}
          <div className="marquee-container bottom">
            <div className="marquee reverse">
              <span>
                {"CHARTHUSTLEZ.ONLINE \u2022 LAUNCHING \u2022 ".repeat(4)}
              </span>
              <span>
                {"CHARTHUSTLEZ.ONLINE \u2022 LAUNCHING \u2022 ".repeat(4)}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
