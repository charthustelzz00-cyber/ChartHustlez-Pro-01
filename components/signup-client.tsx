"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const MATRIX_CHARS =
  "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン$%&@#*+=<>{}[]|^~"

export function SignupClient() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("charthustlez-theme")
    if (saved) {
      document.body.setAttribute("data-theme", saved)
    }
  }, [])

  // Background matrix rain
  useEffect(() => {
    const canvas = canvasRef.current
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
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName || !trimmedEmail) {
      setMessage({ text: "Please complete all fields.", type: "error" })
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ text: "Welcome to ChartHustlez! You're in.", type: "success" })
        setName("")
        setEmail("")
      } else if (res.status === 409) {
        setMessage({ text: "This email is already registered.", type: "error" })
      } else {
        setMessage({ text: data.error || "Something went wrong.", type: "error" })
      }
    } catch {
      setMessage({ text: "Network error. Please try again.", type: "error" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#000" }}>
      <canvas
        ref={canvasRef}
        className="matrix-canvas"
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}
      />
      <div className="signup-container">
        <div className="signup-box">
          <h1>JOIN THE MATRIX</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={submitting}
              aria-label="Full name"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
              aria-label="Email address"
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "ENTERING..." : "ENTER"}
            </button>
          </form>

          {message && (
            <p className={`signup-message ${message.type}`}>
              {message.text}
            </p>
          )}

          <Link href="/" className="signup-back-link">
            {"< BACK TO MAIN"}
          </Link>
        </div>
      </div>
    </div>
  )
}
