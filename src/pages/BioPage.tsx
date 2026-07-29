import { Link } from 'react-router'
import BioTimeline, { educationTimeline, workTimeline } from '../components/BioTimeline'
import PageMetadata from '../components/PageMetadata'

export default function BioPage() {
    return (
        <>
            <PageMetadata title='Bio | Santtu Nurmi' description="Santtu Nurmi's education, work experience, and professional background." />
            <header className='card border-0 mh-10 bg-black'>
                <div className='row g-0 gap-0 row-gab-0'>
                    <div className='Opening-card-fade-80 position-absolute h-100 p-0 z-1'></div>
                    <div className='opening-card-background bio-image col-sm-11 p-0 z-0'></div>
                    <div className='col-sm-1'></div>
                </div>
                <div className='Opening-card-text-block position-absolute rounded-1 p-2 z-1'>
                    <p>People have described me as hard-working, committed, analytical and improvement oriented. I have received praise from the ability to be reflective on my own work, by being able to take in feedback, as well as my strong ability to get things done. My work at EXEN and NUKE-Liiga are the most recent examples of these qualities in action.</p>
                </div>
            </header>
            <article className='container-fluid'>
                <h1 className='pt-3 pb-1 fw-semibold fs-4'>Bio</h1>
                <section className='bio-section' aria-labelledby='education-heading'>
                    <h2 id='education-heading' className='h3 fw-semibold'>Education</h2>
                    <BioTimeline entries={educationTimeline} />
                    <p>My education in information and communication technology at the JAMK University of Applied Sciences in Jyväskylä has taught me the importance of learning new skills. I strongly believe that having a wide range of skills and knowledge is vital for any person to have. You can often find ways to learn how different things can be used together. My education has also challenged me to demand more of myself. I wasn't getting the best grades at the start, and didn't work as hard as I could have to get the most out of my education. A change of heart and a lot of hard work allowed me to turn things around; the momentum of which I've used to kickstart my career.</p>
                </section>
                <section className='bio-section' aria-labelledby='work-heading'>
                    <h2 id='work-heading' className='h3 fw-semibold'>Work</h2>
                    <BioTimeline entries={workTimeline} />
                    <p>In my teenage years I worked several "summer jobs" to get work experience. It is quite common in Finland to do a short one-month internship at a local grocery store, for example. At the time this was just a way for me to get that much needed work experience, but I have come to value the time I spent working at, say, retail. There are people just like you and me doing a lot of important work to keep our stores running. It may be easy to take for granted when we're buying groceries, but without that work we would be buying spoiled milk.</p>
                </section>
                <p style={{ textIndent: '0' }} className='bio'>
                    AI-workflows have become a massive part of how I work, despite of the fact that I used to be strongly anti-AI for a long time. When I understand what the model is doing, and the model understands what I want, I'm able to speed up my productivity, while still maintaining the human touch and creativity. You can read more about my use of AI here: <Link to='/ai' title='Link to my page on AI.'>Link to my page on AI.</Link>
                </p>
                <p style={{ textIndent: '0', marginTop: '1em' }} className='bio'>
                    Outside of my work and education, I also have several different hobbies. A lot of the knowledge and experience that I have, come from these hobbies, and I have been able to successfully implement the things I've learned through them into my work. I'm always working on something, so one shouldn't judge me only by what I do in employment or education. You can read more of my hobbies from here: <Link to='/hobbies' title='Link to my hobbies.'>Link to my hobbies.</Link>
                </p>
            </article>
        </>
    )
}
