export default function SiteFooter() {
    return (
        <>
            <hr className='mt-5' />
            <footer className='p-4'>
                <h2 className='h4 mb-4'>Santtu Nurmi</h2>
                <address>
                    <p>Email: santtunurmi2003@gmail.com</p>
                    <p>
                        LinkedIn:{' '}
                        <a
                            href='https://www.linkedin.com/in/santtu-nurmi-84a233205/'
                            target='_blank'
                            rel='noopener noreferrer'
                            title='LinkedIn'
                        >
                            https://www.linkedin.com/in/santtu-nurmi-84a233205/
                        </a>
                    </p>
                    <p>
                        GitHub:{' '}
                        <a
                            href='https://github.com/santtunurmi'
                            target='_blank'
                            rel='noopener noreferrer'
                            title='GitHub'
                        >
                            https://github.com/santtunurmi
                        </a>
                    </p>
                </address>
            </footer>
        </>
    )
}
