"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const messages = [
  "Received: \"P&ID scan uploaded for Unit 3...\"",
  "Scanning document to extract text regions (OCR)",
  "Extraction complete: 5 fields parsed, avg confidence 0.94",
  "Handoff: Scan Agent to Document Agent",
  "Drafting NFA from extracted data (V-104, Corroded)",
  "Document Agent: draft v1.0 ready for review",
  "Handoff: Document Agent to Approval Agent",
  "Awaiting sign-off from Delegation of Power (DoP) authority",
  "Workflow complete. NFA approved in 342ms.",
  "Idle. Listening for next scan upload...",
]

function AnimatedDot({
  path,
  duration,
  delay,
  size,
  opacity,
}: {
  path: string
  duration: number
  delay: number
  size: number
  opacity: number
}) {
  return (
    <circle r={size} fill="#0a2540" opacity={opacity}>
      <animateMotion
        dur={`${duration}s`}
        repeatCount="indefinite"
        begin={`${delay}s`}
        path={path}
      />
    </circle>
  )
}

function PulsingDot({
  cx,
  cy,
  color,
  duration,
  delay = 0,
}: {
  cx: number
  cy: number
  color: string
  duration: number
  delay?: number
}) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={2.8}
      fill={color}
      animate={{ opacity: [0.15, 1, 0.15] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

function StatusIndicator({
  cx,
  cy,
  color,
  pulsing = false,
  duration = 1.9,
  delay = 0,
}: {
  cx: number
  cy: number
  color: string
  pulsing?: boolean
  duration?: number
  delay?: number
}) {
  if (pulsing) {
    return (
      <motion.circle
        cx={cx}
        cy={cy}
        r={3}
        fill={color}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    )
  }
  return <circle cx={cx} cy={cy} r={3} fill={color} opacity={0.95} />
}

export default function EnterpriseAIPipeline() {
  const [messageIndex, setMessageIndex] = useState(0)
  const [workflows, setWorkflows] = useState(1247)

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 2700)

    const workflowInterval = setInterval(() => {
      setWorkflows((prev) => prev + 1)
    }, 7200)

    return () => {
      clearInterval(messageInterval)
      clearInterval(workflowInterval)
    }
  }, [])

  const paths = {
    p1: "M116,88 L158,88",
    p2: "M268,88 L306,88",
    p3: "M411,88 C425,88 435,50 448,50",
    p4: "M411,88 L448,88",
    p5: "M411,88 C425,88 435,126 448,126",
  }

  return (
    <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden font-sans w-full max-w-4xl mx-auto shadow-sm">
      {/* Header */}
      <div className="px-[18px] py-[11px] border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-[7px]">
          <motion.span
            className="w-[6px] h-[6px] rounded-full bg-green-500 inline-block"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-[10px] text-slate-400 tracking-[0.1em] font-mono">
            GARUDA PIPELINE - LIVE
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          3 checks, 0 errors
        </span>
      </div>

      {/* SVG Pipeline Visualization */}
      <svg width="100%" viewBox="0 0 580 172" className="block">
        <defs>
          <marker
            id="ma"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path
              d="M2 1.5L7.5 5L2 8.5"
              fill="none"
              stroke="rgba(10,37,64,0.45)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>

        <path d={paths.p1} fill="none" stroke="rgba(10,37,64,0.2)" strokeWidth="1.5" strokeDasharray="3 5" markerEnd="url(#ma)" />
        <path d={paths.p2} fill="none" stroke="rgba(10,37,64,0.2)" strokeWidth="1.5" strokeDasharray="3 5" markerEnd="url(#ma)" />
        <path d={paths.p3} fill="none" stroke="rgba(10,37,64,0.14)" strokeWidth="1.5" strokeDasharray="3 5" />
        <path d={paths.p4} fill="none" stroke="rgba(10,37,64,0.14)" strokeWidth="1.5" strokeDasharray="3 5" />
        <path d={paths.p5} fill="none" stroke="rgba(10,37,64,0.14)" strokeWidth="1.5" strokeDasharray="3 5" />

        <AnimatedDot path={paths.p1} duration={1.05} delay={0} size={2.5} opacity={1} />
        <AnimatedDot path={paths.p1} duration={1.05} delay={0.35} size={1.8} opacity={0.65} />
        <AnimatedDot path={paths.p1} duration={1.05} delay={0.7} size={1.3} opacity={0.35} />

        <AnimatedDot path={paths.p2} duration={0.88} delay={0.18} size={2.5} opacity={1} />
        <AnimatedDot path={paths.p2} duration={0.88} delay={0.62} size={1.8} opacity={0.65} />

        <AnimatedDot path={paths.p3} duration={1.3} delay={0.08} size={2.2} opacity={0.9} />
        <AnimatedDot path={paths.p3} duration={1.3} delay={0.65} size={1.5} opacity={0.55} />

        <AnimatedDot path={paths.p4} duration={1.15} delay={0.28} size={2.2} opacity={0.9} />
        <AnimatedDot path={paths.p4} duration={1.15} delay={0.85} size={1.5} opacity={0.55} />

        <AnimatedDot path={paths.p5} duration={1.4} delay={0.45} size={2.2} opacity={0.9} />
        <AnimatedDot path={paths.p5} duration={1.4} delay={1.0} size={1.5} opacity={0.55} />

        <rect x="16" y="66" width="100" height="44" rx="8" fill="#f8fafc" stroke="rgba(10,37,64,0.12)" strokeWidth="0.5" />
        <text x="66" y="83" textAnchor="middle" fontSize="9.5" fill="rgba(10,37,64,0.45)" fontFamily="system-ui" letterSpacing=".07em">INPUT</text>
        <text x="66" y="100" textAnchor="middle" fontSize="12" fill="rgba(10,37,64,0.85)" fontFamily="system-ui">Doc Upload</text>
        <text x="66" y="122" textAnchor="middle" fontSize="8.5" fill="rgba(10,37,64,0.35)" fontFamily="monospace">node-01</text>

        <rect x="158" y="66" width="110" height="44" rx="8" fill="#f8fafc" stroke="rgba(10,37,64,0.12)" strokeWidth="0.5" />
        <text x="213" y="83" textAnchor="middle" fontSize="9.5" fill="rgba(10,37,64,0.45)" fontFamily="system-ui" letterSpacing=".07em">OCR / SCAN</text>
        <text x="213" y="100" textAnchor="middle" fontSize="12" fill="rgba(10,37,64,0.85)" fontFamily="system-ui">Field Extraction</text>
        <text x="213" y="122" textAnchor="middle" fontSize="8.5" fill="rgba(10,37,64,0.35)" fontFamily="monospace">tesseract</text>

        <rect x="306" y="53" width="105" height="70" rx="10" fill="#eef2ff" stroke="#0a2540" strokeWidth="1" />
        <rect x="318" y="53.5" width="80" height="1" rx="0.5" fill="rgba(10,37,64,0.35)" />
        <text x="358" y="78" textAnchor="middle" fontSize="9.5" fill="rgba(10,37,64,0.6)" fontFamily="system-ui" letterSpacing=".07em">DOCUMENT AGENT</text>
        <text x="358" y="97" textAnchor="middle" fontSize="13" fill="#0a2540" fontFamily="system-ui" fontWeight="500">Drafting NFA</text>
        <PulsingDot cx={346} cy={113} color="#0a2540" duration={1.2} delay={0} />
        <PulsingDot cx={358} cy={113} color="#0a2540" duration={1.2} delay={0.4} />
        <PulsingDot cx={370} cy={113} color="#0a2540" duration={1.2} delay={0.8} />
        <text x="358" y="139" textAnchor="middle" fontSize="8.5" fill="rgba(10,37,64,0.4)" fontFamily="monospace">document generation</text>

        <rect x="448" y="35" width="116" height="30" rx="7" fill="#f8fafc" stroke="rgba(10,37,64,0.1)" strokeWidth="0.5" />
        <text x="490" y="53.5" textAnchor="middle" fontSize="11" fill="rgba(10,37,64,0.65)" fontFamily="system-ui">Format Check</text>
        <StatusIndicator cx={550} cy={43} color="#16a34a" />

        <rect x="448" y="73" width="116" height="30" rx="7" fill="#f8fafc" stroke="rgba(10,37,64,0.1)" strokeWidth="0.5" />
        <text x="490" y="91.5" textAnchor="middle" fontSize="11" fill="rgba(10,37,64,0.65)" fontFamily="system-ui">Version Control</text>
        <StatusIndicator cx={550} cy={81} color="#d97706" pulsing duration={1.9} />

        <rect x="448" y="111" width="116" height="30" rx="7" fill="#f8fafc" stroke="rgba(10,37,64,0.1)" strokeWidth="0.5" />
        <text x="490" y="129.5" textAnchor="middle" fontSize="11" fill="rgba(10,37,64,0.65)" fontFamily="system-ui">Approval</text>
        <StatusIndicator cx={550} cy={119} color="#d97706" pulsing duration={2.2} delay={0.35} />
      </svg>

      {/* Message Display */}
      <div className="border-t border-slate-200 px-[18px] py-[9px] h-[52px]">
        <div className="flex gap-2 items-start h-full">
          <span className="text-slate-400 font-mono text-[13px] leading-[1.5] shrink-0">
            &gt;
          </span>
          <div className="relative flex-1 overflow-hidden h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={messageIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="font-mono text-[11px] text-slate-500 leading-[1.55] absolute inset-0"
              >
                {messages[messageIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="border-t border-slate-200 px-[18px] py-[10px] flex gap-[22px] items-center">
        <div>
          <div className="text-[9px] text-slate-400 tracking-[0.09em] mb-[3px]">DOCUMENTS</div>
          <motion.div
            key={workflows}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            className="text-[16px] text-slate-700 font-mono"
          >
            {workflows.toLocaleString()}
          </motion.div>
        </div>
        <div>
          <div className="text-[9px] text-slate-400 tracking-[0.09em] mb-[3px]">ACCURACY</div>
          <div className="text-[16px] text-slate-700 font-mono">98.4%</div>
        </div>
        <div>
          <div className="text-[9px] text-slate-400 tracking-[0.09em] mb-[3px]">AVG LATENCY</div>
          <div className="text-[16px] text-slate-700 font-mono">342ms</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-[9px] text-slate-400 tracking-[0.09em] mb-[3px]">STACK</div>
          <div className="text-[10px] text-slate-600 font-mono">Scan - Document - Approval</div>
        </div>
      </div>
    </div>
  )
}