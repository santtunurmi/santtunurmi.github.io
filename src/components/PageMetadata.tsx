type PageMetadataProps = {
    title: string
    description: string
    canonicalPath?: string
}

const canonicalOrigin = 'https://santtunurmi.netlify.app'

export default function PageMetadata({ title, description, canonicalPath }: PageMetadataProps) {
    return (
        <>
            <title>{title}</title>
            <meta name='description' content={description} />
            {canonicalPath && <link rel='canonical' href={`${canonicalOrigin}${canonicalPath}`} />}
        </>
    )
}
