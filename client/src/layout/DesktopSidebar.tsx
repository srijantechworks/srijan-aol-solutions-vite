import {Link, useLocation, useNavigate} from 'react-router-dom'

import {
    Image as ImageIcon,
    BookOpen,
    Users,
    PanelLeftClose,
    PanelLeftOpen,
    Sparkles,
} from 'lucide-react'

interface Props {
    isCollapsed: boolean
    setIsCollapsed: React.Dispatch<
        React.SetStateAction<boolean>
    >
}

export default function DesktopSidebar({
                                           isCollapsed,
                                           setIsCollapsed,
                                       }: Props) {
    const location = useLocation()
    const navigate = useNavigate()

    const navItems = [
        {
            name: 'Generate Posters',
            href: '#',
            icon: ImageIcon,
            comingSoon: true,
        },
        {
            name: 'Knowledge Sheet',
            href: '/knowledge',
            icon: BookOpen,
        },
        {
            name: 'Open CRM',
            href: '/crm',
            icon: Users,
        },
    ]

    return (
        <aside
            className={`
                hidden md:flex flex-col
                border-r border-white/10
                bg-white/15 backdrop-blur-md
                shadow-2xl

                transition-all duration-500
                ease-[cubic-bezier(0.22,1,0.36,1)]

                will-change-[width]

                ${
                isCollapsed
                    ? 'w-[70px]'
                    : 'w-[255px]'
            }
            `}
        >
            {/* TOP */}
            <div
                className={`
        flex items-center pb-5
        ${isCollapsed ? 'px-1.5' : 'justify-between px-1.5'}
    `}
            >
                {/* LEFT */}
                <div className="flex items-center">
                    {/* LOGO BUTTON */}
                    <button
                        onClick={() => {
                            if (isCollapsed) {
                                setIsCollapsed(false)
                            } else {
                                navigate('/')
                            }
                        }}
                        className="
        group relative flex h-14 w-14 shrink-0 cursor-pointer
        items-center justify-center
        rounded-2xl
        transition-all duration-300
    "
                    >
                        {/* LOGO */}
                        <img
                            src="/srijan-logo.png"
                            alt="logo"
                            className={`
            absolute h-10 w-10 rounded-2xl object-cover
            transition-all duration-300

            ${
                                isCollapsed
                                    ? `
                        opacity-100
                        scale-100
                        group-hover:opacity-0
                        group-hover:scale-75
                    `
                                    : ''
                            }
        `}
                        />

                        {/* EXPAND ICON */}
                        <div
                            className={`
            absolute flex h-10 w-10 items-center justify-center
            rounded-xl
            bg-white/20

            transition-all duration-300

            ${
                                isCollapsed
                                    ? `
                        opacity-0
                        scale-75
                        group-hover:opacity-100
                        group-hover:scale-100
                    `
                                    : `
                        opacity-0 pointer-events-none
                    `
                            }
        `}
                        >
                            <PanelLeftOpen
                                size={26}
                                className="text-white"
                            />
                        </div>
                    </button>

                </div>

                {/* COLLAPSE BUTTON */}
                <button
                    onClick={() =>
                        setIsCollapsed(true)
                    }
                    className={`
                        flex h-10 w-10 shrink-0 cursor-pointer
                        items-center justify-center
                        rounded-xl

                        transition-all duration-300
                        hover:bg-white/30

                        ${
                        isCollapsed
                            ? `
                                    opacity-0 scale-75
                                    pointer-events-none
                                `
                            : `
                                    opacity-100 scale-100
                                `
                    }
                    `}
                >
                    <PanelLeftClose
                        size={26}
                        className="text-black"
                    />
                </button>
            </div>

            {/* CREATE */}
            <div className="px-3 pt-4">
                <Link
                    to="/"
                    className={`
                        flex items-center rounded-xl
                        font-bold h-10

                        transition-all duration-300 ease-out

                        ${
                        isCollapsed
                            ? `
                                    justify-center
                                    w-10 px-0 mx-auto
                                `
                            : `
                                    gap-3 px-4 w-full
                                `
                    }

                        ${
                        location.pathname === '/'
                            ? `
                                    bg-amber-500
                                    text-white shadow-xl
                                `
                            : `
                             
                                    text-neutral-900
                                    hover:bg-white/40
                                `
                    }
                    `}
                >
                    <Sparkles className="h-5 w-5 shrink-0"/>

                    <span
                        className={`
                            overflow-hidden whitespace-nowrap
                            transition-all duration-300

                            ${
                            isCollapsed
                                ? 'w-0 opacity-0'
                                : 'w-auto opacity-100'
                        }
                        `}
                    >
                        Create Message
                    </span>
                </Link>
            </div>

            {/* NAV ITEMS */}
            <div className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
                {navItems.map((item) => {
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`
        flex items-center rounded-xl
        font-semibold h-10

        transition-all duration-300 ease-out

        ${
                                isCollapsed
                                    ? `
                    justify-center
                    w-10 px-0 mx-auto
                `
                                    : `
                    gap-3 px-4 w-full
                `
                            }

        ${
                                location.pathname === item.href
                                    ? `
            bg-amber-500
            text-white shadow-xl
        `
                                    : `
            text-neutral-900
            hover:bg-white/40
        `
                            }

        ${
                                item.comingSoon
                                    ? `
                    pointer-events-none
                    opacity-50
                `
                                    : ''
                            }
    `}
                        >
                            <Icon className="h-5 w-5 shrink-0"/>

                            <span
                                className={`
            overflow-hidden whitespace-nowrap
            transition-all duration-300

            ${
                                    isCollapsed
                                        ? 'w-0 opacity-0'
                                        : 'w-auto opacity-100'
                                }
        `}
                            >
        {item.name}
    </span>
                        </Link>
                    )
                })}
            </div>
        </aside>
    )
}