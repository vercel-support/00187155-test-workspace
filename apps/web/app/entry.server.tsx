import { PassThrough } from 'node:stream'

import type { AppLoadContext, EntryContext } from '@vercel/remix'
import { createReadableStreamFromReadable } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import isbot from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'


const ABORT_DELAY = 5_000

function getServerCookie(request: Request): string {
  const cookies = request.headers.get('cookie')
  if (!cookies) {
    return ''
  }
  return (
    cookies
    .split(';')
    .find((cookie) => cookie.startsWith('__session'))
    ?.split('=')[1] || ''
  )
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
) {
  return isbot(request.headers.get('user-agent'))
    ? handleBotRequest(request, responseStatusCode, responseHeaders, remixContext)
    : handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext)
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise(async (resolve, reject) => {
    let shellRendered = false



    const App = (

        <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />

    )


    const { pipe, abort } = renderToPipeableStream(App, {
      onAllReady() {
        shellRendered = true
        const body = new PassThrough()

        // Write the initial part of the document.
        body.write('<!DOCTYPE html>')

        const stream = createReadableStreamFromReadable(body)
        responseHeaders.set('Content-Type', 'text/html')

        resolve(
          new Response(stream, {
            headers: responseHeaders,
            status: responseStatusCode,
          }),
        )

        pipe(body)
      },
      onShellError(error: unknown) {
        reject(error)
      },
      onError(error: unknown) {
        responseStatusCode = 500
        if (shellRendered) {
          console.error(error)
        }
      },
    })

    setTimeout(abort, ABORT_DELAY)
  })
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise(async (resolve, reject) => {
    let shellRendered = false


    const App = (

        <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />

    )


    const { pipe, abort } = renderToPipeableStream(App, {
      onShellReady() {
        shellRendered = true
        const body = new PassThrough()

        // Write the initial part of the document.
        body.write('<!DOCTYPE html>')


        const stream = createReadableStreamFromReadable(body)
        responseHeaders.set('Content-Type', 'text/html')

        resolve(
          new Response(stream, {
            headers: responseHeaders,
            status: responseStatusCode,
          }),
        )

        pipe(body)
      },
      onShellError(error: unknown) {
        reject(error)
      },
      onError(error: unknown) {
        responseStatusCode = 500
        if (shellRendered) {
          console.error(error)
        }
      },
    })

    setTimeout(abort, ABORT_DELAY)
  })
}
