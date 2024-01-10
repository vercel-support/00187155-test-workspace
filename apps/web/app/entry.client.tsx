import { RemixBrowser } from '@remix-run/react'
import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'


function Client() {

  return (
      <RemixBrowser />
  )
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <Client />
    </StrictMode>,
  )
})
