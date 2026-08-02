import { Link } from 'react-router'
import { motion } from 'motion/react'
import { useState } from 'react'
import EducationAndWorkTimeline from '../components/education-and-work/EducationAndWorkTimeline'
import { educationAndWorkTimeline } from '../components/education-and-work/education-and-work-data'
import { createTimelineScale } from '../components/education-and-work/timeline-layout'
import OpeningCard from '../components/OpeningCard'
import PageMetadata from '../components/PageMetadata'
import { useInViewReveal } from '../components/motion'
import { siteRoutes } from '../routes'

export default function EducationAndWorkPage() {
    const timelineReveal = useInViewReveal(0, 0)
    const proseReveal = useInViewReveal(2, 0.1)
    const [timelineScale] = useState(createTimelineScale)

    return (
        <>
            <PageMetadata title='Education & Work | Santtu Nurmi' description="My education, work experience, and professional background." canonicalPath={siteRoutes.educationAndWork} />
            <OpeningCard profile='education-and-work'>
                <p>
                    People have described me as hard-working, committed, analytical, and improvement-oriented. I have been praised for reflecting on my own work,
                    taking feedback seriously, and getting things done. My projects and work at EXEN and NUKE-Liiga are the most recent examples of these qualities in action.
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
                                My education in information and communication technology at JAMK University of Applied Sciences in Jyväskylä has taught me the importance of learning new skills.
                                I strongly believe that a wide range of skills and knowledge is vital, because it helps you see how different things can work together.
                                My education has also challenged me to demand more of myself. I did not get the best grades at the start, and I did not work as hard as I could have to get the most out of my education.
                                A change of heart and a lot of hard work allowed me to turn things around; I have used that momentum to kickstart my career.
                            </p>
                        </div>
                        <div className='mt-4'>
                            <p>
                                In my teenage years, I worked several summer jobs to gain work experience. In Finland, it is quite common to do a short internship at a local grocery store,
                                for example. At the time, this was simply a way to get much-needed work experience, but I have come to value the time I spent working in retail.
                                People just like you and me do important work to keep our stores running. It is easy to take that for granted when buying groceries, but without that work,
                                we would be buying spoiled milk.
                            </p>
                        </div>
                        <div className='mt-4'>
                            <p>
                                AI-assisted workflows have become a major part of how I work, despite being strongly anti-AI for a long time.
                                When I understand what a model is doing and can guide it clearly, it helps me move faster without giving up human judgment or creativity.
                            </p>
                            <p>
                                You can read more about how I use AI here:
                            </p>
                            <Link to={siteRoutes.ai} title='Read more about my use of AI.'>my AI page</Link>
                        </div>
                        <div className='mt-4'>
                            <p>
                                Outside work and education, I have several hobbies. Much of my knowledge and experience comes from them,
                                and I have been able to bring what I learn there into my work. I am always working on something,
                                so I do not think I should be judged only by what I do in employment or education.
                            </p>
                            <p>
                                You can read more about my hobbies here:
                            </p>
                            <Link to={siteRoutes.hobbies} title='Read more about my hobbies.'>my hobbies page</Link>
                        </div>
                    </motion.section>
                </section>
            </article>
        </>
    )
}
