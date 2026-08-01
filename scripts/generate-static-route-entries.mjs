import { copyFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docsDirectory = resolve(projectRoot, 'docs')
const sourceDocument = resolve(docsDirectory, 'index.html')

const staticEntryDocuments = [
    '404.html',
    'education-and-work.html',
    'bio.html',
    'ai.html',
    'hobbies.html',
    'webserver.html',
    'education-and-work/index.html',
    'bio/index.html',
    'ai/index.html',
    'hobbies/index.html',
    'webserver/index.html',
]

await Promise.all(
    staticEntryDocuments.map(async (relativePath) => {
        const destination = resolve(docsDirectory, relativePath)

        await mkdir(dirname(destination), { recursive: true })
        await copyFile(sourceDocument, destination)
    }),
)
