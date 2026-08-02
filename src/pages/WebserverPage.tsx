import { useState, type FormEvent } from 'react'
import OpeningCard from '../components/OpeningCard'
import PageMetadata from '../components/PageMetadata'
import { siteRoutes } from '../routes'

export default function WebserverPage() {
    const [loggedIn, setLoggedIn] = useState(false)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoggedIn((current) => !current)
    }

    function handleSpeedrunSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
    }

    return (
        <>
            <PageMetadata title='Webserver easter egg | Santtu Nurmi' description="A speedrun-themed webserver easter egg in Santtu Nurmi's portfolio." canonicalPath={siteRoutes.webserver} />
            <OpeningCard profile='webserver'>
                <p>You have found an easter egg</p>
            </OpeningCard>
            <div className={`container-sm login ${loggedIn ? 'd-none' : 'd-block'} p-2`}>
                <form className='login' onSubmit={handleSubmit}>
                    <div className='row g-3'>
                        <label htmlFor='staticEmail' className='col-form-label'>
                            You must login to view your current speedruns and to add new ones.
                        </label>
                        <div className=''>
                            <input type='text' readOnly className='form-control-plaintext' id='staticEmail' value='(login is secure)' />
                        </div>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='exampleInputEmail1' className='form-label'>Email address</label>
                        <input type='email' className='form-control' id='exampleInputEmail1' aria-describedby='emailHelp' />
                        <div id='emailHelp' className='form-text'></div>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='exampleInputPassword1' className='form-label'>Password</label>
                        <input type='password' className='form-control' id='exampleInputPassword1' />
                    </div>
                    <div className='mb-3 form-check'>
                        <input type='checkbox' className='form-check-input' id='exampleCheck1' />
                        <label className='form-check-label' htmlFor='exampleCheck1'>Remember me</label>
                    </div>
                    <button type='submit' className='btn btn-primary'>This does nothing</button>
                </form>
            </div>
            <form className={`container-sm input ${loggedIn ? 'd-block' : 'd-none'} p-2 Web-server-text-block`} onSubmit={handleSpeedrunSubmit}>
                <h2>Add Speedrun</h2>
                <div className='input-group mb-3'>
                    <input type='text' className='form-control' placeholder='Game' aria-label='Game' />
                </div>
                <div className='input-group mb-3'>
                    <input type='text' className='form-control' placeholder='Category' aria-label='Category' />
                </div>
                <div className='input-group mb-3'>
                    <input type='text' className='form-control' placeholder='Time. (e.g. 1:00:00.000)' aria-label='Time' />
                    <input type='text' className='form-control' placeholder='Variables. (e.g. RTA=yes)' aria-label='Variables' />
                </div>
                <div className='input-group mb-3'>
                    <input type='text' className='form-control' placeholder='Video Link' aria-label='Video' />
                </div>
                <div className='input-group mb-3'>
                    <textarea className='form-control' placeholder='Comments.' aria-label='Comments'></textarea>
                </div>
                <div className='col-auto'>
                    <button type='submit' className='btn btn-primary mb-3'>Add Speedrun</button>
                </div>
            </form>
            <div className='container-fluid'>
                <h1 className='pt-3 pb-1 fw-semibold fs-4'>Speedruns:</h1>
            </div>
        </>
    )
}
