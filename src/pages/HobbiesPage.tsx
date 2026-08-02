import OpeningCard from '../components/OpeningCard'
import PageMetadata from '../components/PageMetadata'
import { siteRoutes } from '../routes'

export default function HobbiesPage() {
    return (
        <>
            <PageMetadata title='Hobbies | Santtu Nurmi' description="My hobbies in speedrunning and music." canonicalPath={siteRoutes.hobbies} />
            <OpeningCard profile='hobbies'>
                <p>
                    I believe that one should constantly learn new things. My projects and work at EXEN and NUKE-Liiga provide recent examples of leveraging skills learned through my
                    hobbies and applying them to real, tangible projects.
                </p>
            </OpeningCard>
            <div className='container-fluid'>
                <h1 className='pt-3 pb-1 fw-semibold fs-4'>Hobbies</h1>
                <p>
                    I originally had a wall of text here, which probably showed my passion for music and video game speedrunning but I think keeping it shorter is most likely better for
                    everyone involved.
                </p>
                <h2 className='h5 pt-3 pb-3'>Speedrunning</h2>
                <p>
                    I started speedrunning video games when I was 12. For more than 10 years, I have gone on to make a lot of wonderful friends through the hobby, learn a lot of valuable skills,
                    get a few world records, and even travel to Austin, Texas, to meet some of my speedrunning friends and attend our first Counter-Strike Major together.
                    I got involved with NUKE-Liiga off the back of my work on charity events in our speedrunning community. Through the hobby,
                    I also gained a strong understanding of tools like OBS for streaming.
                </p>
                <p>
                    These skills were key in my work for NUKE-Liiga, but ultimately it was my ability to withstand pressure that played the biggest part in my success.
                    There was a heavy emphasis on trying to survive the pressure, as we were producing live broadcasts, which can be a lot for someone with no prior experience in live performance.
                </p>
                <p>
                    We concluded that speedrunning is almost a natural teacher for handling pressure. You must play flawlessly to get a new personal best,
                    with the pressure often mounting to ridiculous levels toward the very end of the game. This creates an environment where you must learn strategies to
                    handle the pressure if you want to continue to improve your time. By the time I came to NUKE-Liiga, I had been speedrunning for 10 years and had been there and done that,
                    in a way.
                </p>
                <h2 className='h5 pt-3 pb-3'>Music</h2>
                <p>
                    I quit streaming music altogether at one point. I listened to just CDs and vinyl LPs. It's difficult to say what exactly makes physical media better for listening to music.
                    It's not the audio quality; I can tell you that. Rather, I think it's just about creating an obstacle between you and the music. Upon overcoming that obstacle,
                    the act of listening to music itself feels much more gratifying and exciting. It's also about limitations. You're forced to listen to your own music collection,
                    and listening to anything outside of that sphere requires going out and buying the record.
                </p>
                <p>
                    Typing it out seems like I had regressed in some way, but it's just about a deliberate change in behavior that makes enjoying music easier.
                    It is an extreme departure from the ability to listen to whatever you want, whenever you want. Now I mix it up, since there is plenty of good new music,
                    which has not been released as physical media, yet. As for instruments, I play bass guitar, guitar, and keyboards. I'd say I'm mainly a singer, though.
                    Really, I just think music is neat.
                </p>
            </div>
        </>
    )
}
