export const siteRoutes = {
    home: '/',
    educationAndWork: '/education-and-work',
    ai: '/ai',
    hobbies: '/hobbies',
    webserver: '/webserver',
} as const

export type SiteRoute = (typeof siteRoutes)[keyof typeof siteRoutes]

export const educationAndWorkRouteGroup: readonly SiteRoute[] = [
    siteRoutes.educationAndWork,
    siteRoutes.webserver,
]

export const legacyRouteRedirects: readonly { from: string; to: SiteRoute }[] = [
    { from: '/index.html', to: siteRoutes.home },
    { from: '/education-and-work.html', to: siteRoutes.educationAndWork },
    { from: '/bio', to: siteRoutes.educationAndWork },
    { from: '/bio.html', to: siteRoutes.educationAndWork },
    { from: '/ai.html', to: siteRoutes.ai },
    { from: '/hobbies.html', to: siteRoutes.hobbies },
    { from: '/webserver.html', to: siteRoutes.webserver },
]
