import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

class TestIntersectionObserver implements IntersectionObserver {
    readonly root = null
    readonly rootMargin = '0px'
    readonly scrollMargin = '0px'
    readonly thresholds = [0]

    constructor(private readonly callback: IntersectionObserverCallback) {}

    disconnect() {}

    observe(target: Element) {
        this.callback([{
            boundingClientRect: target.getBoundingClientRect(),
            intersectionRatio: 1,
            intersectionRect: target.getBoundingClientRect(),
            isIntersecting: true,
            rootBounds: null,
            target,
            time: performance.now(),
        }], this)
    }

    takeRecords(): IntersectionObserverEntry[] {
        return []
    }

    unobserve() {}
}

class TestResizeObserver implements ResizeObserver {
    constructor(private readonly callback: ResizeObserverCallback) {}

    disconnect() {}

    observe(target: Element) {
        this.callback([{
            borderBoxSize: [],
            contentBoxSize: [],
            contentRect: target.getBoundingClientRect(),
            devicePixelContentBoxSize: [],
            target,
        }], this)
    }

    unobserve() {}
}

Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
    })),
})

Object.defineProperty(window, 'IntersectionObserver', {
    configurable: true,
    value: TestIntersectionObserver,
})

Object.defineProperty(window, 'ResizeObserver', {
    configurable: true,
    value: TestResizeObserver,
})

Object.defineProperty(window, 'scrollTo', {
    configurable: true,
    value: vi.fn(),
})

Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
})

Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
    configurable: true,
    value: vi.fn(),
})

Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    value: vi.fn(),
})

HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '')
}

HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
}

afterEach(() => {
    cleanup()
    document.head.innerHTML = ''
    vi.restoreAllMocks()
})
