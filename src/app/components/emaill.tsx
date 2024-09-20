import type { EmailQuery } from '@/gql/graphql'
import { EmailAddresses } from './email-address'
import { EmailDate } from './email-date'
import { EmailBody } from './email-body'
import styled from 'styled-components'
import { Skeleton } from '@zendeskgarden/react-loaders'

const EmailContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`

const EmailContent = styled.div`
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const EmailHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const EmailField = styled.p`
  margin: 0;
`

const EmailLabel = styled.span`
  color: GrayText;
`

const EmailSubject = styled.span`
  font-weight: 500;
`

const EmailBodyContainer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.palette.grey[200]};
  padding-top: 1rem;
`

export const EmailSkeleton = () => (
  <EmailContainer>
    <EmailContent>
      <EmailHeader>
        <Skeleton width="60%" height="20px" />
        <Skeleton width="70%" height="20px" />
        <Skeleton width="50%" height="20px" />
        <Skeleton width="80%" height="20px" />
      </EmailHeader>
      <EmailBodyContainer>
        <Skeleton width="100%" height="200px" />
      </EmailBodyContainer>
    </EmailContent>
  </EmailContainer>
)

export const Email = ({ email }: { email: EmailQuery['emails'][0] }) => {
  if (!email) {
    return null
  }

  return (
    <EmailContainer>
      <EmailContent>
        <EmailHeader>
          {email.from && (
            <EmailField>
              <EmailLabel>From:</EmailLabel> <EmailAddresses emails={email.from} />
            </EmailField>
          )}
          {email.to && (
            <EmailField>
              <EmailLabel>To:</EmailLabel> <EmailAddresses emails={email.to} />
            </EmailField>
          )}
          {email.cc.length > 0 && (
            <EmailField>
              <EmailLabel>CC:</EmailLabel> <EmailAddresses emails={email.cc} />
            </EmailField>
          )}
          {email.bcc.length > 0 && (
            <EmailField>
              <EmailLabel>BCC:</EmailLabel> <EmailAddresses emails={email.bcc} />
            </EmailField>
          )}
          <EmailField>
            <EmailLabel>Subject:</EmailLabel> <EmailSubject>{email.subject}</EmailSubject>
          </EmailField>
          <EmailField>
            <EmailLabel>Date:</EmailLabel> {email.date && <EmailDate date={email.date} absolute />}
          </EmailField>
        </EmailHeader>
        <EmailBodyContainer>
          <EmailBody body={email.body} />
        </EmailBodyContainer>
      </EmailContent>
    </EmailContainer>
  )
}
