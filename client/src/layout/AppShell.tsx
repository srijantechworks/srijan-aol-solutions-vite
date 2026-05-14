import type {ReactNode} from 'react'
import {useLocation} from 'react-router-dom'
import {useState} from 'react'
import {useSidebarState} from '@/hooks/useSidebarState'

import Navbar from '@/components/ui/Navbar'
import PageWrapper from '@/components/ui/PageWrapper'

import DesktopSidebar from './DesktopSidebar'
import MobileBottomNav from './MobileBottomNav'

interface Props {
    children: ReactNode
}

export default function AppShell({
                                     children,
                                 }: Props) {
    const location = useLocation()

    const isAboutPage =
        location.pathname === '/about'

    const {
        isCollapsed: isSidebarCollapsed,
        setIsCollapsed: setIsSidebarCollapsed,
    } = useSidebarState()

    return (
        <div className="relative flex h-dvh w-screen overflow-hidden bg-[#fdf6e3] text-neutral-900">

            {/* BACKGROUND IMAGE */}
            <div
                className={`
        absolute inset-0 z-0
        bg-cover bg-center bg-no-repeat
        transition-all duration-700 ease-out
        will-change-transform

        ${
                    isAboutPage
                        ? 'scale-105 blur-sm brightness-90'
                        : 'scale-100 blur-0 brightness-100'
                }
    `}
                style={{
                    backgroundImage: "url('/vm_update.png')",
                }}
            />

            {/* GLOBAL ATMOSPHERIC OVERLAY */}
            <div
                className={`
          absolute inset-0 z-10 pointer-events-none
          transition-all duration-500 ease-out

          ${
                    isAboutPage
                        ? `
                bg-black/25
                
              `
                        : `
                bg-black/10
              `
                }
        `}
            />

            {/* APP */}
            <div className="relative z-20 flex h-full w-full overflow-hidden">

                {/* SIDEBAR */}
                <DesktopSidebar
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                />

                {/* MAIN */}
                <div className="relative flex flex-1 flex-col overflow-hidden">

                    <Navbar isSidebarCollapsed={isSidebarCollapsed}/>

                    <main
                        id="app-scroll-container"
                          onScroll={(e) => {
                              sessionStorage.setItem(
                                  'app-scroll-top',
                                  e.currentTarget.scrollTop.toString()
                              )
                          }}
                          ref={(el) => {
                              if (!el) return

                              const saved = sessionStorage.getItem(
                                  'app-scroll-top'
                              )

                              if (saved) {
                                  el.scrollTop = Number(saved)
                              }
                          }}
                        className={`
        flex-1 overflow-y-auto overflow-x-hidden
        pb-24 md:pb-0

        ${
                            isSidebarCollapsed
                                ? 'pt-0'
                                : 'pt-24'
                        }
    `}
                    >
                        <PageWrapper>
                            {children}
                        </PageWrapper>
                    </main>
                </div>

                {/* MOBILE NAV */}
                <MobileBottomNav/>
            </div>
        </div>
    )
}