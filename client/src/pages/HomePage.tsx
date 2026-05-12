import {Sparkles} from 'lucide-react'

import GeneratorForm from '../components/features/GeneratorForm'

export default function HomePage() {
    return (
        <div className="flex min-h-full flex-col items-center justify-start px-4 pt-28 pb-28 text-center md:pt-24">
            {/* TOP BADGE */}
            <div
                className="
                    mb-6 inline-flex items-center gap-2
                    rounded-full
                    border border-neutral-200
                    bg-white/80
                    px-5 py-2
                    text-sm font-medium
                    text-neutral-700
                    shadow-sm
                    backdrop-blur-lg
                "
            >
                <Sparkles className="h-4 w-4 text-amber-500"/>

                <span>
                    For Art of Living teachers & volunteers across the globe
                </span>
            </div>

            {/* HERO */}
            <h1
                className="
                    max-w-5xl
                    text-4xl font-black tracking-tight
                    text-neutral-900
                    sm:text-3xl
                    lg:text-5xl
                "
            >
                Share your course with

                <span
                    className="
        block
        bg-gradient-to-r
        from-amber-400
        via-orange-500
        to-amber-600
        bg-clip-text
        text-transparent
    "
                >
    warmth & ease
</span>
            </h1>

            {/* SUBTEXT */}
            <p
                className="
                    mt-6 mb-10
                    max-w-4xl
                    text-base leading-relaxed
                    text-neutral-100
                    sm:text-xl
                "
            >
                Paste an Art of Living course link and we’ll craft three
                beautiful, WhatsApp-ready messages you can share in seconds.
            </p>

            {/* FORM */}
            <GeneratorForm/>

        </div>
    )
}