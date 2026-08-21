import ArticleContext from '../components/ArticleContext'
import OpeningCard from '../components/OpeningCard'
import PageMetadata from '../components/PageMetadata'
import SiteNav from '../components/SiteNav'
import { siteRoutes } from '../routes'

export default function AiPage() {
    return (
        <>
            <PageMetadata title='AI-Assisted Workflows | Santtu Nurmi' description="My approach to AI-assisted workflows, tools, and learning." canonicalPath={siteRoutes.aiAssistedWorkflows} />
            <OpeningCard profile='ai'>
                <p>
                    I've gone from being strongly anti-AI to seeing how it can be used to get things done faster and better, and now I treat AI-assisted workflow design as a fundamental skill.
                </p>
                <p>
                    This page is about that evolution.
                </p>
            </OpeningCard>
            <SiteNav />
            <div className='container-fluid'>
                <ArticleContext label='Article' />
                <h1 className='pb-1 fw-semibold fs-4'>AI-Assisted Workflows</h1>
                <p>
                    I tend to use AI for work in files, code, or text, or when I need knowledge I do not immediately have. I have a lot of ideas, so when starting work on something,
                    I translate them for the model of my choice. I prompt through conversation: I format my messages as I would to a human, paint the picture, provide the necessary context,
                    and steer the work as it develops. It is important to understand what you want yourself, so I spend a lot of time thinking about what I write. This can involve extensive research,
                    testing, and learning. I might enlist a different model to help if it is a good fit. The key is to understand what the model understands and where it is missing the picture.
                    Once we are on the same page, I usually set up source-of-truth documentation to keep the context centered. I trust the model to handle itself well, but review, troubleshoot,
                    and verify its work. Often, the problem is missing context or unclear communication rather than a mistake by the model. When the model does make a mistake,
                    I point it out and steer it in the right direction. The main thing I try to avoid is prolonged misalignment between the model and me.
                    I often ask for explanations and clarifications on things I do not understand. Understanding what the model is doing, and the model understanding what I want,
                    is the basis for a functional workflow.
                </p>
                <h2 className='h5 pt-3 pb-3'>Tools I Use</h2>
                <p>
                    I use ChatGPT Codex for demanding technical work. I find Claude Code's more verbose and exploratory nature useful, especially when I want to investigate an approach,
                    though I have also run into mistakes on tasks that ChatGPT Codex would handle well. I use both actively depending on the work and the usage available to me. If a model is struggling,
                    I switch approaches or models rather than repeating the same fixes. OpenCode is my coding workbench across models, while OpenClaw is the management and context layer.
                </p>
                <h2 className='h5 pt-3 pb-3'>How I Got Here</h2>
                <p>
                    I remember first seeing my classmates at university messing around with ChatGPT in 2022. It was mostly used for goofs, and the quality of the output was quite poor.
                    Very quickly, I saw people start using it for their coursework. They got it done fast and did get good grades, but I got the feeling that they were not really learning.
                    I was really struggling with university at the time, so I thought it would be a sort of Pandora's box to simply rely on it to get things done.
                    I ended up using it for one course and did not feel good about myself. I wanted to actually learn how things worked instead of relying on something else to get the work done
                    for me. I mostly based my strong anti-AI stance on this principle.
                </p>
                <p>
                    The turning point came on Christmas Day 2025. I had a conversation with a family friend about AI, and they made the shrewd point that my tendency to rely heavily on
                    Stack Overflow to get unstuck while coding was very similar to using AI. They pointed me to Peter Steinberger's fantastic blog post "Just Talk To It",
                    which I then read religiously, over and over again, until I understood what I was reading. The sequel, "Shipping at Inference-Speed",
                    was released right around that time and also became a source of truth for me. The hipster in me felt good when OpenClaw, then named Clawdbot, became massive a few weeks later.
                    After years of refusing, I got on the train at the literal perfect time.
                </p>
                <p>
                    All of this got me thinking that using AI did not necessarily prevent me from learning how things got done. It did not mean I had to compromise on quality, either.
                    If something did not turn out how I wanted it, I could use my own knowledge and experience to steer the model to do it better. I could always jump in to fix it myself too.
                    It is important to me that the human touch stays intact. This was the sales pitch when I applied for an internship at EXEN,
                    where I developed and refined an agentic engineering workflow through varied projects. At the same time, I finished the data analytics and AI module at my university,
                    where I learned how to use AI to empower learning and research. Instead of getting stuck on obscure syntax,
                    I could spend my time learning the big picture of what I was being taught.
                </p>
                <p>
                    The data analytics and AI module gave me a bird's-eye view of machine learning: from data analysis and data preprocessing,
                    through courses on algorithms and the underlying concepts of modeling, to comparing and eventually building machine-learning and deep-learning models.
                    I used tools such as Jupyter, Anaconda, Pandas, scikit-learn, and R; preprocessed data in SQL, JSON, APIs, regex, Excel, and XML;
                    and compared and evaluated machine-learning models such as kNN, Naive Bayes, Random Forest, and PCA, as well as deep-learning architectures such as CNNs, RNNs, LSTMs,
                    and autoencoders. Everything was wrapped up by a group project where my group and I preprocessed a million rows of data, compared several approaches,
                    and built a prediction model for future data.
                </p>
                <p>
                    These courses taught me a lot about the fundamental technical aspects of the many AI models around us today.
                    I think the sizable data analytics portion of these courses also gave me a better understanding of why good data is so important.
                    They also served as a great refresher on Python, which is what I first started coding with in high school. The group project at the end was a highlight for me.
                    I was initially anxious about it, but the group turned out to be really into AI. It was an interesting experience working together and figuring out how we could fit our
                    agentic workflows together. Ultimately, active human communication kept the project on track. Clear responsibilities, good Git hygiene,
                    and everyone managing their environment well were key to the success of our project. At the tail end, I insisted that we manually reread all of the code we wrote.
                    We did this to extensively analyze and comment on the codebase, but as I had suspected, it also revealed a number of issues in our project.
                    This step forced us to go back to the drawing board and fix our mistakes. When we did, we had created a strong body of work that was one of the strongest results in the course.
                    This taught me that human review is invaluable when it comes to agentic work, a principle I have held firmly ever since.
                    It all goes back to understanding your model and your model understanding you.
                </p>
                <p>
                    I moved to Linux as my main operating system in the summer of 2026, which was the final change that really unlocked the full potential of AI-assisted workflows for me.
                    Previously, I was working in tight WSL environments, but now I had much more freedom to speed things up using the skills I had built up.
                    This allowed me to tackle many projects in my spare time that I otherwise would not have gotten around to.
                    These projects kept my skills sharp while simultaneously refining my workflow into a complete stack of the tools I had messed around with independently from the start of the
                    year: ChatGPT Codex for demanding and complex tasks, Claude Code for useful verbose and exploratory work, OpenCode as the coding workbench,
                    and OpenClaw as the management and context layer. I just talk to them and get things done.
                </p>
            </div>
        </>
    )
}
