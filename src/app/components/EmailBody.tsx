import type { EmailQuery } from '@/gql/graphql'
import { lazy } from 'react'

const Letter = lazy(() => import('react-letter').then((mod) => ({ default: mod.Letter })))

export const EmailBody = ({ body }: { body: EmailQuery['emails'][0]['body'] }) => {
  const html = body?.html || ''
  const text = body?.text || ''

  return <Letter html={html} text={text} />
}
