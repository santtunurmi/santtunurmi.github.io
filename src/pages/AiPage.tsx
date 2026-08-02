import OpeningCard from '../components/OpeningCard'
import PageMetadata from '../components/PageMetadata'
import { siteRoutes } from '../routes'

export default function AiPage() {
    return (
        <>
            <PageMetadata title='AI-Assisted Workflows | Santtu Nurmi' description="My approach to AI-assisted workflows, tools, and learning." canonicalPath={siteRoutes.ai} />
            <OpeningCard profile='ai'>
                <p>
                    I've gone from being strongly anti-AI, to seeing how it can be used to get things done faster AND better, to finally mastering AI-workflows as a fundamental part of how I work.
                </p>
                <p>
                    This page is about that evolution.
                </p>
            </OpeningCard>
            <div className='container-fluid'>
                <h1 className='pt-3 pb-1 fw-semibold fs-4'>AI-assisted Workflows</h1>
                <p>
                    I tend to use AI, when it comes to things that work in files, code or text, or that require knowledge I don't immediately have. I have a lot of ideas,
                    so when starting work on something, I translate these ideas to the model of my choice. I don't prompt. Instead, I format my messages the way I would to a human.
                    I paint the picture, provide the necessary context, and start a conversation. It's important to understand what you want yourself,
                    so I spend a lot of the time thinking about what I write. This can involve extensive research, testing and learning. I might enlist a different model to help with this,
                    if it's fit for a model. The key is to understand what the model understands, and where it's not getting the picture. When we are on the same page,
                    I usually like to setup documentation, so that there's an established "source-of-truth". This helps keep the context centered. In order for this to work,
                    you need to trust the model to handle itself well. Often the problem isn't the model failing at a task. If it does, I point out the mistake, and nudge it to a correct direction.
                    The main thing I try to avoid, is conflict between the model and me. I often ask for explanations and clarifications on specific things I don't understand.
                    Understanding what the model is doing, and the model understanding what I want, is the basis for an actually functional workflow.
                </p>
                <h2 className='h5 pt-3 pb-3'>Tools I Use</h2>
                <p>
                    I use ChatGPT as my main model. I use Codex for projects with a codebase, use it as the model for my OpenClaw for more complex tasks, and use it as my main model for OpenCode,
                    both as the Code-layer for my OpenClaw, and for myself. I like the more verbose and eager nature of Anthropic Claude Code, especially for smaller tasks,
                    but have ran into mistakes on tasks that Codex would handle well. I use both models actively, depending on what I need, and where my model usage is at.
                    I previously used OpenClaw for mostly small personal tasks and projects, but switching to Linux has allowed me to use it as more of a managing-layer,
                    utilizing OpenCode to separate the code-layer of different tasks.
                </p>
                <h2 className='h5 pt-3 pb-3'>How I Got Here</h2>
                <p>
                    I remember first seeing my classmates at university messing around with ChatGPT in 2022. It was mostly used for goofs, and the quality of the output was quite poor.
                    Very quickly, I saw people start using it for their coursework. They got it done fast, and did get good grades, but I got the feeling that they were not really learning.
                    I was really struggling with university at the time, so I thought it would be a sort of Pandora's box to simply rely on it to get things done.
                    I ended up using it for one course, and did not feel good about myself. I wanted to actually learn how things worked, instead of relying on something else to get the work done for me.
                    I mostly based my strong anti-AI stance on this principle.
                </p>
                <p>
                    The turning point came Christmas Day 2025. I had a conversation with a family friend about AI, where they made the shrew point, that my tendency to rely heavily on
                    Stack Overflow to get me unstuck while coding, was very similar to just using AI. He pointed me to Peter Steinbergers fantastic blog post "Just Talk To It",
                    which I then read religiously, over and over again, until I understood what I was reading. The sequel, "Shipping at Inference-Speed", released right around that time,
                    which was also a source-of-truth for me. The hipster in me felt good, when Openclaw (then named Clawdbot) became massive a few weeks later. After years of refusing,
                    I got on the train at the literal perfect time.
                </p>
                <p>
                    All of this got me thinking, that using AI did not necessarilly prevent me from learning how thing got done. It didn't mean I had to compromise on quality, either.
                    If something didn't turn out how I wanted it, I could use my own knowledge and experience to steer the model to do it again better. I could always jump in to fix it myself too.
                    It's important to me, that the human touch stays intact. This was the sales pitch when I applied for an internship at EXEN, where I was allowed to master agentic engineering
                    over interesting, varied and complex projects. At the same time I finished the data-analytics and AI module in my university, where I learned how to use AI to empower learning and
                    research. Instead of getting stuck on obscure syntax, I could spend my time learning the big picture of what I was being taught.
                </p>
                <p>
                    The data-analytics and AI module gave me a bird's-eye view of the machine learning model: From data-analysis and data preprocessing, through courses on algorithms and
                    underlying concepts on modeling, to comparing and eventually building machine- and deep learning models. Using tooling, such as Jupyter/Anaconda, Pandas, scikit-learn and R.
                    Preprocessing data in SQL, JSON, APIs, Regex, in addition to Excel/XML. Comparing and evaluating machine-learning models like kNN, Naive Bayes, Random Forest and PCA,
                    as well as deep learning architechture, like CNN, RNN, LSTM and Autoencoder. With everything wrapped up by a group-project, where me and my group preprocessed a million rows of data,
                    which was then used to model several machine learning models for comparison, to be able to create an accurate prediction model for future data.
                </p>
                <p>
                    These courses taught me a lot about the fundamental technical aspects of the many AI models around us today. I think the sizable portion of data-analytics in these courses also
                    gave me a better understanding of why good data is so important. These courses also served as a great refresher on Python, which is what I first started coding with back in
                    High School. The group-project at the end was a higlight for me. I was initially anxious about it, but the group turned out to all be really into AI.
                    It was an interesting experience working together and figuring out how we could fit our agentic workflows together. Ultimately it was active human communication that kept the
                    project on it's tracks. Having clear responsibilities, good Git-hygiene, and everyone managing their environment well, were key to the success of our project. At the tail end,
                    I insisted, that we should re-read all of the code we wrote, manually. We did this to extensively analyze and comment the codebase, but as I had suspected,
                    it also revealed a number of issues in our project. This step forced us to go back to the drawing board and fix our mistakes. When we did, we had created an iron-tight body of work,
                    that placed us as one of the top groups in the course. This taught me, that human review is invaluable when it comes to agentic work, which is a principle I've held firmly ever since.
                    It all goes back to understanding your model, and your model understanding you.
                </p>
                <p>
                    I moved to Linux as my main operating system in the summer of 2026, which was the final change to really unlock the full potential of AI-workflows for me.
                    Previously I was working in tight WSL environments, but now I had much more freedom to speed things up using the skills I had built up. This allowed me to tackle many projects in
                    my spare time, that I otherwise wouldn't have gotten around to. These projects kept my skills sharp, while simultaniously refining my workflow into a complete stack of all of the
                    tools I had messed around with independantly from the start of the year. ChatGPT codex for demanding and complex tasks, Anthropic Claude Code for verbose and fast output,
                    OpenCode for the coding layer and Openclaw for the management layer. I just talk to them, and get things done.
                </p>
            </div>
        </>
    )
}
