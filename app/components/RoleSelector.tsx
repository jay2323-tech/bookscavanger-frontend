interface Props {
    role: 'librarian' | 'customer'
    setRole: (role: 'librarian' | 'customer') => void
  }
  
  export default function RoleSelector({ role, setRole }: Props) {
    return (
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setRole('librarian')}
          className={`flex-1 py-2 rounded-lg border ${
            role === 'librarian'
              ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
              : 'border-gray-700 text-gray-400 hover:border-[#D4AF37]'
          }`}
        >
          Librarian
        </button>
  
        <button
          onClick={() => setRole('customer')}
          className={`flex-1 py-2 rounded-lg border ${
            role === 'customer'
              ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
              : 'border-gray-700 text-gray-400 hover:border-[#D4AF37]'
          }`}
        >
          Customer
        </button>
      </div>
    )
  }
  