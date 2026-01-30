interface Props {
  book: {
    title: string
    author: string
    libraryName: string
    distance: number
    available: boolean
  }
}

export default function BookResultCard({ book }: Props) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-[#D4AF37] transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{book.title}</h3>
          <p className="text-slate-400">{book.author}</p>
          <p className="mt-2 text-sm text-slate-300">
            📍 {book.libraryName} • {book.distance.toFixed(1)} km away
          </p>
        </div>

        <span
          className={`text-sm px-3 py-1 rounded-full ${
            book.available
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {book.available ? 'Available' : 'Not Available'}
        </span>
      </div>
    </div>
  )
}
