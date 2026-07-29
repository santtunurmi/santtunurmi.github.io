import { Link } from 'react-router'
import { motion } from 'motion/react'
import BioTimeline, { educationTimeline, workTimeline } from '../components/BioTimeline'
import PageMetadata from '../components/PageMetadata'
import { useInViewReveal } from '../components/motion'

export default function BioPage() {
    const educationReveal = useInViewReveal()
    const workReveal = useInViewReveal(0.04)

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
                    <p>People have described me as hard-working, committed, analytical, and improvement-oriented. I have been praised for reflecting on my own work, taking feedback seriously, and getting things done. My projects and work at EXEN and NUKE-Liiga are the most recent examples of these qualities in action.</p>
                </div>
            </header>
            <article className='container-fluid'>
                <h1 className='pt-3 pb-1 fw-semibold fs-4'>Bio</h1>
                <motion.section className='bio-section' aria-labelledby='education-heading' {...educationReveal}>
                    <h2 id='education-heading' className='h3 fw-semibold'>Education</h2>
                    <BioTimeline entries={educationTimeline} />
                    <p>My education in information and communication technology at JAMK University of Applied Sciences in Jyväskylä has taught me the importance of learning new skills. I strongly believe that a wide range of skills and knowledge is vital, because it helps you see how different things can work together. My education has also challenged me to demand more of myself. I did not get the best grades at the start, and I did not work as hard as I could have to get the most out of my education. A change of heart and a lot of hard work allowed me to turn things around; I have used that momentum to kickstart my career.</p>
                </motion.section>
                <motion.section className='bio-section' aria-labelledby='work-heading' {...workReveal}>
                    <h2 id='work-heading' className='h3 fw-semibold'>Work</h2>
                    <BioTimeline entries={workTimeline} />
                    <p>In my teenage years, I worked several summer jobs to gain work experience. In Finland, it is quite common to do a short internship at a local grocery store, for example. At the time, this was simply a way to get much-needed work experience, but I have come to value the time I spent working in retail. People just like you and me do important work to keep our stores running. It is easy to take that for granted when buying groceries, but without that work, we would be buying spoiled milk.</p>
                </motion.section>
                <p style={{ textIndent: '0' }} className='bio'>
                    AI-assisted workflows have become a major part of how I work, despite being strongly anti-AI for a long time. When I understand what a model is doing and can guide it clearly, it helps me move faster without giving up human judgment or creativity. You can read more about how I use AI here: <Link to='/ai' title='Read more about my use of AI.'>my AI page</Link>.
                </p>
                <p style={{ textIndent: '0', marginTop: '1em' }} className='bio'>
                    Outside work and education, I have several hobbies. Much of my knowledge and experience comes from them, and I have been able to bring what I learn there into my work. I am always working on something, so I do not think I should be judged only by what I do in employment or education. You can read more about my hobbies here: <Link to='/hobbies' title='Read more about my hobbies.'>my hobbies page</Link>.
                </p>
            </article>
        </>
    )
}
