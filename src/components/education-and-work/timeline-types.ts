import type { ContentImage, ContentLink } from '../../models/content'

export type TimelineMonth = {
    year: number
    month: number
}

type TimelinePlacement = {
    lane?: number
    titleSide?: 'left' | 'right'
    titleOffset?: number
}

export type TimelineGeometry = TimelinePlacement & (
    | {
          type: 'duration'
          start: TimelineMonth
          end: TimelineMonth | 'current'
      }
    | {
          type: 'point'
          at: TimelineMonth
      }
)

export type TimelineEntry = {
    id: string
    title: string
    organization: string
    location: string
    period: string
    description?: string
    caseStudy?: Extract<ContentLink, { type: 'internal' }>
    links?: readonly ContentLink[]
    images?: readonly ContentImage[]
    geometry: TimelineGeometry
}

export type TimelineScale = {
    baseline: TimelineMonth
    current: TimelineMonth
    months: number
}

export type TimelineDateSide = 'left' | 'right'
