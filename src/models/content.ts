type LinkDetails = {
    title: string
    text: string
}

export type LinkTarget =
    | {
          type: 'internal'
          to: string
      }
    | {
          type: 'external'
          href: string
      }

export type ContentLink = LinkDetails & LinkTarget

export type ContentImage = {
    src: string
    alt: string
}
