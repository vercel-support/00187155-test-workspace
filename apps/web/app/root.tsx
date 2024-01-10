import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import stylesheet from './tailwind.css'
import { useEffect } from 'react'
import 'regenerator-runtime/runtime'
import type { LinksFunction, MetaFunction } from '@vercel/remix'
import { Analytics } from '@vercel/analytics/react'

export const meta: MetaFunction = () => {
  return [{ title: 'Muzebook' }]
}

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }]

export default function App() {
  // required parameter to fetch images
  const urlEndpoint = 'https://ik.imagekit.io/muze'
  const publicKey = 'public_aFc8JSXNekXRIGrKXGN6X6prnl4='
  let authenticationEndpoint = ''

  useEffect(() => {
    authenticationEndpoint = `${window.location.origin}/api/upload/token`
  })

  async function authenticator() {
    console.log(authenticationEndpoint)
    try {
      // You can also pass headers and validate the request source in the backend, or you can use headers for any other use case.
      const headers = {
        CustomHeader: 'CustomValue',
      }

      const response = await fetch(authenticationEndpoint, {
        headers,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Request failed with status ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      const { signature, expire, token } = data
      return { signature, expire, token }
    } catch (error) {
      throw new Error(`Authentication request failed: ${(error as Error).message}`)
    }
  }

  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body>

        <Outlet />


    <ScrollRestoration />
    <Scripts />
    <LiveReload />
    <Analytics />
    </body>
    </html>
  )
}
