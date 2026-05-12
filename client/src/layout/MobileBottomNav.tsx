import {Link, useLocation} from 'react-router-dom'

import {
    MessageSquare,
    Image as ImageIcon,
    BookOpen,
    Infinity,
    Users,
} from 'lucide-react'

export default function MobileBottomNav() {
    const location = useLocation()

    const items = [
        {
            name: 'Create',
            href: '/',
            icon: MessageSquare,
            color: 'amber',
        },
        {
            name: 'Posters',
            href: '#',
            icon: ImageIcon,
            disabled: true,
            color: 'neutral',
        },
        {
            name: 'Knowledge',
            href: '/knowledge',
            icon: BookOpen,
            color: 'blue',
        },
        {
            name: 'Infinity',
            href: '/whisperity-infinity',
            icon: Infinity,
            color: 'violet',
        },
        {
            name: 'CRM',
            href: '/crm',
            icon: Users,
            color: 'emerald',
        },
    ]

    return (
        <nav className="
    fixed bottom-2 left-1.5 right-1.5 z-50

    rounded-full
    bg-neutral-700/30
    backdrop-blur-3xl

    shadow-2xl
    border border-neutral-800/50

    md:hidden
">
            <div className="flex items-center justify-between px-2 py-2 pb-safe">
                {items.map((item) => {
                    const Icon = item.icon

                    const active =
                        location.pathname === item.href
                    const colorStyles = {
                        amber: {
                            icon: 'text-amber-500',
                            text: 'text-amber-500',
                            bg: 'bg-amber-500/15',
                        },
                        blue: {
                            icon: 'text-sky-500',
                            text: 'text-sky-500',
                            bg: 'bg-sky-500/15',
                        },
                        violet: {
                            icon: 'text-violet-500',
                            text: 'text-violet-500',
                            bg: 'bg-violet-500/15',
                        },
                        emerald: {
                            icon: 'text-emerald-500',
                            text: 'text-emerald-500',
                            bg: 'bg-emerald-500/15',
                        },
                        neutral: {
                            icon: 'text-neutral-400',
                            text: 'text-neutral-400',
                            bg: 'bg-neutral-400/10',
                        },
                    }

                    const styles =
                        colorStyles[
                            item.color as keyof typeof colorStyles
                            ]

                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className="
        flex flex-1 items-center justify-center self-stretch
    "
                        >
                            <div
                                className="
        relative
        flex flex-col items-center justify-center
        gap-1
        rounded-l-full rounded-r-full
        min-w-[68px] max-w-[82px] py-1.5
        transition-all duration-300 -translate-y-[1px]
    "
                            >
                                {active && (
                                    <div
                                        className={`
                absolute
                inset-x-0
                inset-y-0
                -translate-y-[2.75px]
                rounded-l-full rounded-r-full
                -z-10
                shadow-lg
                ${styles.bg}
            `}
                                    />
                                )}
                                <Icon
                                    className={`h-5 w-5 transition-all p-[0.5px] -translate-y-1 ${
                                        active
                                            ? styles.icon
                                            : item.disabled
                                                ? 'text-neutral-600'
                                                : 'text-white'
                                    }`}
                                />

                                <span
                                    className={`text-[10px] font-semibold p-[0.5px] tracking-tight text-center leading-tight transition-all -translate-y-1 ${
                                        active
                                            ? styles.text
                                            : item.disabled
                                                ? 'text-neutral-600'
                                                : 'text-white'
                                    }`}
                                >
            {item.name}
        </span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}