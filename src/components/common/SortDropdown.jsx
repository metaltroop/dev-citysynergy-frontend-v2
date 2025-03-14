"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, ArrowUp, ArrowDown } from "lucide-react"

/**
 * SortDropdown component for sorting table data
 * @param {Object} props
 * @param {Array} props.options - Array of options {label, value}
 * @param {Function} props.onSortChange - Callback when sort changes
 * @param {string} props.defaultField - Default field to sort by
 * @param {string} props.defaultOrder - Default order (asc or desc)
 */
const SortDropdown = ({ options, value, order, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Ensure options is always an array
  const safeOptions = Array.isArray(options) ? options : []

  // Add default value if none provided
  const currentOption = safeOptions.find((opt) => opt.value === value) || safeOptions[0]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleFieldChange = (value) => {
    onChange(value, order)
    setIsOpen(false)
  }

  const toggleSortOrder = () => {
    onChange(value, order === "asc" ? "desc" : "asc")
  }

  return (
    <div className="relative inline-flex" ref={dropdownRef}>
      <div className="flex items-center">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-l-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <span className="font-medium">Sort by</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
        <button
          onClick={toggleSortOrder}
          className="flex items-center px-2 py-1.5 bg-white dark:bg-gray-800 border border-l-0 border-gray-200 dark:border-gray-700 rounded-r-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          {order === "asc" ? (
            <ArrowUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg top-full left-0">
          <ul className="py-1">
            {safeOptions.map((option) => (
              <li key={option.value}>
                <button
                  onClick={() => handleFieldChange(option.value)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    value === option.value ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : ""
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

SortDropdown.defaultProps = {
  options: [],
  value: "",
  order: "asc",
  onChange: () => {},
}

export default SortDropdown

