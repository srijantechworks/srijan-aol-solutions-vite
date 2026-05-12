import {
    useEffect,
    useRef,
    useState,
} from 'react'

import { ChevronDown } from 'lucide-react'

interface Option {
    value: string
    label: string
}

interface Props {
    label: string
    options: Option[]
    value: string
    onChange: (value: string) => void
}

export default function CustomSelect({
                                         label,
                                         options,
                                         value,
                                         onChange,
                                     }: Props) {
    const [isOpen, setIsOpen] =
        useState(false)

    const dropdownRef =
        useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleOutsideClick = (
            event: MouseEvent | TouchEvent,
        ) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target as Node,
                )
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener(
            'mousedown',
            handleOutsideClick,
        )

        document.addEventListener(
            'touchstart',
            handleOutsideClick,
        )

        return () => {
            document.removeEventListener(
                'mousedown',
                handleOutsideClick,
            )

            document.removeEventListener(
                'touchstart',
                handleOutsideClick,
            )
        }
    }, [])

    const selectedLabel =
        options.find(
            (opt) => opt.value === value,
        )?.label || 'Select...'

    return (
        <div
            ref={dropdownRef}
            className="relative flex flex-col gap-2"
        >
            {/* LABEL */}
            <label className="text-sm font-semibold text-neutral-800">
                {label}
            </label>

            {/* SELECT BUTTON */}
            <button
                type="button"
                onClick={() =>
                    setIsOpen(!isOpen)
                }
                className="flex min-h-[56px] w-full items-center justify-between rounded-2xl border border-white/20 bg-white/80 px-4 py-3 text-left text-neutral-900 shadow-lg backdrop-blur-sm transition-all hover:border-amber-300 active:scale-[0.99]"
            >
        <span className="truncate">
          {selectedLabel}
        </span>

                <ChevronDown
                    className={`h-5 w-5 shrink-0 text-neutral-500 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {/* DROPDOWN */}
            {isOpen && (
                <div className="absolute left-0 top-[78px] z-50 max-h-72 w-full overflow-y-auto rounded-2xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value)
                                setIsOpen(false)
                            }}
                            className={`w-full px-4 py-4 text-left text-sm transition-all
                  
                  ${
                                value === opt.value
                                    ? 'bg-amber-100 font-semibold text-amber-900'
                                    : 'text-neutral-700 hover:bg-amber-50'
                            }
                `}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}