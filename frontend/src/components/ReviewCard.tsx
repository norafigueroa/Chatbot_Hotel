import type { ReviewSource } from '../types'

const REVIEW_SOURCES: ReviewSource[] = [
  { name: 'Google', score: '4.8', outOf: '5' },
  { name: 'TripAdvisor', score: '4.8', outOf: '5' },
  { name: 'Booking.com', score: '9.0', outOf: '10' },
  { name: 'Expedia', score: '9.4', outOf: '10' },
]

/** Tarjeta flotante con el resumen de reseñas del hotel. */
export default function ReviewCard() {
  return (
    <div className="absolute bottom-16 left-6 z-10 w-56 overflow-hidden rounded-sm border border-white/5 shadow-2xl">
      <div className="flex items-center justify-between bg-brand-teal p-2 text-[10px] font-bold uppercase tracking-wider">
        <span>Review Summary</span>
        <span>▼</span>
      </div>

      <div className="border-b border-white/10 bg-[#1a1a1a] p-4 text-center">
        <div className="flex items-end justify-center gap-1 text-3xl font-bold">
          4.7 <span className="mb-1 text-sm font-normal opacity-60">/ 5</span>
        </div>
        <div className="mt-1 text-xs font-bold text-white">Excellent</div>
        <div className="mt-1 text-[9px] uppercase text-white/50">460 reviews</div>
      </div>

      <div className="space-y-2 bg-[#1a1a1a] p-4 text-[11px]">
        {REVIEW_SOURCES.map((source) => (
          <div key={source.name} className="flex justify-between">
            <span className="opacity-70">{source.name}</span>
            <span className="font-bold">
              {source.score}{' '}
              <span className="font-normal opacity-50">/ {source.outOf}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
