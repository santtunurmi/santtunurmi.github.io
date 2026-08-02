import { Link } from 'react-router'
import { motion } from 'motion/react'
import { useState } from 'react'
import EducationAndWorkTimeline, { createTimelineScale, educationAndWorkTimeline } from '../components/EducationAndWorkTimeline'
import OpeningCard from '../components/OpeningCard'
import PageMetadata from '../components/PageMetadata'
import { useInViewReveal } from '../components/motion'

export default function EducationAndWorkPage() {
    const timelineReveal = useInViewReveal(0, 0)
    const proseReveal = useInViewReveal(2, 0.1)
    const [timelineScale] = useState(createTimelineScale)

    return (
        <>
            <PageMetadata title='Education & Work | Santtu Nurmi' description="My education, work experience, and professional background." canonicalPath='/education-and-work' />
            <OpeningCard profile='education-and-work'>
                <p>
                    People have described me as hard-working, committed, analytical and improvement oriented. I have received praise from the ability to be reflective on my own work,
                    by being able to take in feedback, as well as my strong ability to get things done. My work at EXEN and NUKE-Liiga are the most recent examples of these qualities in action.
                </p>
            </OpeningCard>
            <article className='container-fluid mt-5'>
                <section className='education-and-work-timeline-block row g-4'>
                    <motion.section className='col-md-8' aria-labelledby='timeline-heading' {...timelineReveal}>
                        <h1 id='timeline-heading' className='fw-semibold'>Education & Work Timeline</h1>
                        <EducationAndWorkTimeline entries={educationAndWorkTimeline} scale={timelineScale} />
                    </motion.section>
                    <motion.section className='col-md-4 row g-4 justify-content-between' aria-labelledby='info-heading' {...proseReveal}>
                        <div>
                            <h2 id='info-heading' className='h3 fw-semibold'>Info</h2>
                            <p className='mt-5'>
                                My education in information and communication technology at the JAMK University of Applied Sciences in Jyväskylä has taught me the importance of learning new skills.
                                I strongly believe that having a wide range of skills and knowledge is vital for any person to have. You can often find ways to learn how different things can be used
                                together. My education has also challenged me to demand more of myself. I wasn't getting the best grades at the start, and didn't work as hard as I could have to get the
                                most out of my education. A change of heart and a lot of hard work allowed me to turn things around; the momentum of which I've used to kickstart my career.
                            </p>
                        </div>
                        <div className='mt-4'>
                            <p>
                                In my teenage years I worked several "summer jobs" to get work experience. It is quite common in Finland to do a short one-month internship at a local grocery store,
                                for example. At the time this was just a way for me to get that much needed work experience, but I have come to value the time I spent working at, say, retail.
                                There are people just like you and me doing a lot of important work to keep our stores running. It may be easy to take for granted when we're buying groceries,
                                but without that work we would be buying spoiled milk.
                            </p>
                        </div>
                        <div className='mt-4'>
                            <p>
                                AI-workflows have become a massive part of how I work, despite of the fact that I used to be strongly anti-AI for a long time. When I understand what the model is doing,
                                and the model understands what I want, I'm able to speed up my productivity, while still maintaining the human touch and creativity.
                            </p>
                            <p>
                                You can read more about my use of AI here:
                            </p>
                            <Link to='/ai' title='Read more about my use of AI.'>Link to my page on AI</Link>
                        </div>
                        <div className='mt-4'>
                            <p>
                                Outside of my work and education, I also have several different hobbies. A lot of the knowledge and experience that I have, come from these hobbies,
                                and I have been able to successfully implement the things I've learned through them into my work. I'm always working on something, so one shouldn't judge me only by
                                what I do in employment or education.
                            </p>
                            <p>
                                You can read more about my hobbies here:
                            </p>
                            <Link to='/hobbies' title='Read more about my hobbies.'>Link to my page about hobbies</Link>
                        </div>
                    </motion.section>
                </section>
            </article>
        </>
    )
}
