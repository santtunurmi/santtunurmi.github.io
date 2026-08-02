import OpeningCard from '../components/OpeningCard'
import PageMetadata from '../components/PageMetadata'

export default function HobbiesPage() {
    return (
        <>
            <PageMetadata title='Hobbies | Santtu Nurmi' description="My hobbies in speedrunning and music." canonicalPath='/hobbies' />
            <OpeningCard profile='hobbies'>
                <p>
                    I believe that one should constantly learn new things. My work at EXEN and NUKE-Liiga are the latest examples of leveraging skills learnt through my hobbies,
                    and applying them to real, tangible projects.
                </p>
            </OpeningCard>
            <div className='container-fluid'>
                <h1 className='pt-3 pb-1 fw-semibold fs-4'>Hobbies</h1>
                <p>
                    I originally had a wall of text here, which probably showed my passion for music and video game speedrunning but I think keeping it shorter is most likely better for
                    every party involved.
                </p>
                <h2 className='h5 pt-3 pb-3'>Speedrunning</h2>
                <p>
                    I started speedrunning video games when I was 12. In the past 10 years I have gone on to make a lot of wonderful friends through the hobby, learnt a lot of valuable skills,
                    gotten a few world records and even travelled to Austin, Texas to meet some of my speedrunning friends for our first Counter-Strike major.
                    I got my "NUKE-Liiga" off the back of my work on charity events in our speedrunning community. Additionally, I had gathered a comprehensive understanding on tools like OBS for
                    streaming through the hobby.
                </p>
                <p>
                    These skills were key in my work for NUKE-Liiga, but ultimately it was my ability to withstand pressure, that played the biggest part in my success.
                    There was a heavy emphasis on trying to survive the pressure, as we were doing live broadcasts, with up to 200 live viewers, which can be a lot for someone,
                    with no prior experience in live performance.
                </p>
                <p>
                    We concluded that speedrunning is almost a natural teacher for handling pressure. You must play flawlessly, to get a new personal best,
                    with the pressure often mounting to ridiculous levels towards the very end of the game. This creates an environment where you must learn strategies to handle the pressure,
                    if you want to continue to improve your time. Having done the speedrunning for 10 years, by the time I came to NUKE-Liiga, I had been there and done that, in a way.
                </p>
                <h2 className='h5 pt-3 pb-3'>Music</h2>
                <p>
                    I quit streaming music all together recently. Now I try to listen to just CD and vinyl LPs. It's difficult to say what exactly makes physical mediums better for listening to music.
                    It's not the quality of music; I can tell you that. Rather I think it's just about creating an obstacle between you and the music. Upon overcoming that obstacle,
                    the act of listening to music itself will feel much more gratifying and exciting. It's also about limitations. You're forced to listen to your selection of music,
                    and listening to anything outside of that sphere requires going out and buying the record.
                </p>
                <p>
                    Typing it out seems like I have regressed in some way, but it's just about artificial change to behavior, that makes enjoying music easier.
                    It is just an extreme departure from the ability to listen to whatever you want, whenever you want. As for instruments, I play bass guitar, guitar and keyboards.
                    I'd say I'm mainly a singer, though. Really, I just think music is neat.
                </p>
            </div>
        </>
    )
}
