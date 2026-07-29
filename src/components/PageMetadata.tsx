type PageMetadataProps = {
    title: string
    description: string
}

export default function PageMetadata({ title, description }: PageMetadataProps) {
    return (
        <>
            <title>{title}</title>
            <meta name='description' content={description} />
        </>
    )
}
