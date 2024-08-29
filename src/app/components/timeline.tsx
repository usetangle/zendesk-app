import { Timeline as ZendeskTimeline } from '@zendeskgarden/react-accordions'
import { graphql } from '@/gql/gql'
import { Col, Row } from '@zendeskgarden/react-grid'
import { EmailAddresses } from './EmailAddresses'
import { Span } from '@zendeskgarden/react-typography'
import { Button } from '@zendeskgarden/react-buttons'
import styled from 'styled-components'
import { useGraphqlQuery } from '@/app/hooks/useGraphqlQuery'
import { EmailsQuery } from '@/gql/graphql'
import { Suspense } from 'react'
import { Skeleton } from '@zendeskgarden/react-loaders'
import { EmailDate } from './EmailDate'
import { Paragraph, Title, Well } from '@zendeskgarden/react-notifications'

const StyledTimelineItem = styled(ZendeskTimeline.Item)`
  .view-email-button {
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
  }

  &:hover .view-email-button {
    opacity: 1;
  }
`

const emails = graphql(`
  query Emails($address: String!) {
    emails(input: { filters: { address: $address } }) {
      id
      subject
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
    }
  }
`)

const TimelineSkeleton = () =>
  [...Array(3)].map((_, index) => (
    <Col key={index} size={12} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <Row>
        <Skeleton style={{ width: '100%', height: '8rem', marginTop: '1rem' }} />
      </Row>
    </Col>
  ))

const TimelineContent = ({
  address,
  emailViewHandler
}: {
  address: string
  emailViewHandler: (params: URLSearchParams) => void
}) => {
  const { data } = useGraphqlQuery<EmailsQuery>({
    queryKey: ['emails', address],
    document: emails,
    variables: {
      address
    },
    suspense: true
  })

  if (data === undefined) {
    return null
  }

  if (data.emails.length === 0) {
    return (
      <Well style={{ flexGrow: '1', marginTop: '1rem' }}>
        <Title>No recent emails found</Title>
        <Paragraph>New emails will appear here</Paragraph>
      </Well>
    )
  }

  return (
    <ZendeskTimeline>
      {data.emails.map((email, index) => (
        <StyledTimelineItem key={index}>
          <ZendeskTimeline.Content>
            <Row style={{ fontWeight: '500' }}>{email.subject}</Row>
            <Row style={{ color: 'GrayText', display: 'block' }}>
              {!!email.from && <EmailAddresses emails={email.from} />}
              {!!email.to && (
                <>
                  <Span> to </Span>
                  <EmailAddresses emails={email.to} />
                </>
              )}
            </Row>
            <Row style={{ color: 'GrayText' }}>
              <Span>
                <EmailDate date={email.date} />{' '}
                <Button
                  isLink
                  className="view-email-button"
                  onClick={() => emailViewHandler(new URLSearchParams({ emailId: email.id }))}
                >
                  View email
                </Button>
              </Span>
            </Row>
          </ZendeskTimeline.Content>
        </StyledTimelineItem>
      ))}
    </ZendeskTimeline>
  )
}

export default function Timeline({
  address,
  emailViewHandler
}: {
  address: string
  emailViewHandler: (params: URLSearchParams) => void
}) {
  return (
    <Suspense fallback={<TimelineSkeleton />}>
      <TimelineContent address={address} emailViewHandler={emailViewHandler} />
    </Suspense>
  )
}
