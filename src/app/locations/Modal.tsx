import { graphql } from '@/gql'
import { EmailQuery } from '@/gql/graphql'
import { useGraphqlQuery } from '@/app/hooks/use-graphql-query'
import { Suspense } from 'react'
import { Email, EmailSkeleton } from '../components/emaill'

const email = graphql(`
  query Email($id: String!) {
    emails(input: { filters: { id: $id } }) {
      date
      from {
        value {
          address
          name
        }
      }
      to {
        value {
          address
          name
        }
      }
      cc {
        value {
          address
          name
        }
      }
      bcc {
        value {
          address
          name
        }
      }
      subject
      body {
        html
        text
      }
    }
  }
`)

const EmailContent = ({ id }: { id: string }) => {
  const { data } = useGraphqlQuery<EmailQuery>({
    queryKey: ['emails', id],
    document: email,
    variables: { id }
  })

  if (!data || data.pages[0].emails.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%'
        }}
      >
        <div>No email found</div>
      </div>
    )
  }

  return <Email email={data.pages[0].emails[0]} />
}

const Modal = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const id = searchParams.get('emailId') || ''

  return (
    <Suspense fallback={<EmailSkeleton />}>
      <EmailContent id={id} />
    </Suspense>
  )
}

export default Modal
