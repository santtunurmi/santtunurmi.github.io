export const siteRoutes = {
    home: '/',
    educationAndWork: '/education-and-work',
    blog: '/blog',
    aiAssistedWorkflows: '/blog/ai-assisted-workflows',
    exenCaseStudy: '/blog/exen-internship',
    esportsCaseStudy: '/blog/esports-event-production',
    hobbies: '/blog/hobbies',
    webserver: '/webserver',
} as const

export type SiteRoute = (typeof siteRoutes)[keyof typeof siteRoutes]

export const legacyRouteRedirects: readonly { from: string; to: SiteRoute }[] = [
    { from: '/index.html', to: siteRoutes.home },
    { from: '/education-and-work.html', to: siteRoutes.educationAndWork },
    { from: '/bio', to: siteRoutes.educationAndWork },
    { from: '/bio.html', to: siteRoutes.educationAndWork },
    { from: '/ai', to: siteRoutes.aiAssistedWorkflows },
    { from: '/ai.html', to: siteRoutes.aiAssistedWorkflows },
    { from: '/blog.html', to: siteRoutes.blog },
    { from: '/hobbies', to: siteRoutes.hobbies },
    { from: '/hobbies.html', to: siteRoutes.hobbies },
    { from: '/webserver.html', to: siteRoutes.webserver },
]
