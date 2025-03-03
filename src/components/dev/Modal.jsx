export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) {
    if (!isOpen) return null
  
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className={`bg-white rounded-xl shadow-lg w-full ${maxWidth} mx-4 transform transition-all`}>
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    )
  }
  
  