import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://sis.it.tufts.edu/*"]
}

// Inject Tailwind and the "Sledgehammer" CSS to hide the old portal
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = `
    ${cssText}
    /* Hide everything on the original page except our new Plasmo app */
    body > *:not(plasmo-csui) {
      display: none !important;
    }
    body {
      background-color: #0f172a !important; /* slate-900 */
      margin: 0;
      padding: 0;
    }
  `
  return style
}

const SISModernizer = () => {
  const [data, setData] = useState({
    holds: 0,
    alerts: 0,
    scheduleText: "Loading schedule...",
    isLoading: true
  })

  // The DOM Scraper
  useEffect(() => {
    const scrapeData = () => {
      const pageText = document.body.innerText

      // Vibe-coding heuristics: simple regex to find numbers next to keywords
      const holdsMatch = pageText.match(/Holds\s*(\d+)/i)
      const alertsMatch = pageText.match(/You have\s*(\d+)\s*Alert/i)

      // Look for the empty schedule state
      const hasNoClasses = pageText.includes("No Classes Scheduled")
      const scheduleStatus = hasNoClasses
        ? "No Classes Scheduled for Summer 2026."
        : "Classes found. (Calendar view coming soon)"

      setData({
        holds: holdsMatch ? parseInt(holdsMatch[1]) : 0,
        alerts: alertsMatch ? parseInt(alertsMatch[1]) : 0,
        scheduleText: scheduleStatus,
        isLoading: false
      })
    }

    // Delay slightly to ensure the legacy Javascript has populated the DOM
    setTimeout(scrapeData, 500)
  }, [])

  if (data.isLoading)
    return (
      <div className="p-10 text-sky-400 font-mono">
        Initializing Student Environment...
      </div>
    )

  return (
    <div className="flex h-screen w-full bg-slate-900 text-slate-200 font-sans">
      {/* LEFT SIDEBAR - Unified Navigation */}
      <nav className="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Tufts <span className="text-sky-500">SIS</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
            Student Portal
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <NavItem title="Dashboard" active />
          <NavItem title="Academics & Registration" />
          <NavItem title="Finances & Billing" />
          <NavItem title="Student Life" />
        </div>

        <div className="mt-auto border-t border-slate-700 pt-6">
          <NavItem title="Settings & Profile" />
          <NavItem title="Log Out" isDanger />
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-light text-white">Dashboard</h2>
            <p className="text-slate-400 mt-1">Saturday, June 6, 2026</p>
          </div>
          <button className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md text-sm font-medium transition-colors shadow-lg">
            Canvas ↗
          </button>
        </header>

        {/* ACTION CENTER */}
        {(data.holds > 0 || data.alerts > 0) && (
          <div className="mb-8 bg-amber-500/10 border border-amber-500/50 rounded-lg p-5 flex items-start gap-4 shadow-sm">
            <div className="text-amber-400 text-xl">⚠️</div>
            <div>
              <h3 className="text-amber-400 font-semibold text-lg">
                Action Required
              </h3>
              <p className="text-amber-200/80 mt-1">
                You have{" "}
                <strong className="text-amber-200">{data.holds} Hold(s)</strong>{" "}
                and{" "}
                <strong className="text-amber-200">
                  {data.alerts} Alert(s)
                </strong>
                . These may prevent registration or requests for transcripts.
              </p>
              <button className="mt-3 text-sm bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1.5 rounded transition-colors">
                Resolve Issues
              </button>
            </div>
          </div>
        )}

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-3 gap-6">
          {/* Schedule Card */}
          <div className="col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-white mb-4">My Schedule</h3>
            <div className="flex items-center justify-center h-40 bg-slate-900/50 rounded-lg border border-slate-700/50 border-dashed">
              <p className="text-slate-400 text-sm">{data.scheduleText}</p>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm flex flex-col gap-3">
            <h3 className="text-lg font-medium text-white mb-2">
              Quick Actions
            </h3>
            <QuickActionBtn title="Search Course Catalog" />
            <QuickActionBtn title="View Unofficial Transcript" />
            <QuickActionBtn title="Pay Tufts Bill" />
          </div>
        </div>
      </main>
    </div>
  )
}

// --- Helper Components ---

const NavItem = ({
  title,
  active = false,
  isDanger = false
}: {
  title: string
  active?: boolean
  isDanger?: boolean
}) => (
  <button
    className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? "bg-sky-500/10 text-sky-400"
        : isDanger
          ? "text-rose-400 hover:bg-rose-500/10"
          : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
    }`}>
    {title}
  </button>
)

const QuickActionBtn = ({ title }: { title: string }) => (
  <button className="w-full text-left px-4 py-3 bg-slate-700/30 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-all flex justify-between items-center group">
    {title}
    <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
      →
    </span>
  </button>
)

export default SISModernizer
