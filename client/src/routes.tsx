import { createBrowserRouter } from 'react-router-dom'

import AppShell from './layout/AppShell'

import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import KnowledgePage from './pages/KnowledgePage'

export const router =
    createBrowserRouter([
        {
            path: '/',
            element: (
                <AppShell>
                    <HomePage />
                </AppShell>
            ),
        },

        {
            path: '/about',
            element: (
                <AppShell>
                    <AboutPage />
                </AppShell>
            ),
        },

        {
            path: '/knowledge',
            element: (
                <AppShell>
                    <KnowledgePage />
                </AppShell>
            ),
        },
    ])