import { Timeline as ZendeskTimeline } from '@zendeskgarden/react-accordions'
import { graphql } from '@/gql/gql'
import { Col, Row } from '@zendeskgarden/react-grid'
import { EmailAddresses } from './email-address'
import { Span } from '@zendeskgarden/react-typography'
import { Button } from '@zendeskgarden/react-buttons'
import styled from 'styled-components'
import { useGraphqlQuery } from '@/app/hooks/use-graphql-query'
import { EmailsQuery } from '@/gql/graphql'
import { Suspense } from 'react'
import { Skeleton } from '@zendeskgarden/react-loaders'
import { EmailDate } from './email-date'
import { GlobalAlert, Paragraph, Title, Well } from '@zendeskgarden/react-notifications'
import { EmailStatus } from './email-status'
import InfiniteScroll from 'react-infinite-scroll-component'

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
  query Emails($address: String!, $after: DateTime, $pageSize: Float) {
    emailsPaginated(input: { filters: { address: $address }, after: $after, pageSize: $pageSize }) {
      items {
        id
        createdAt
        subject
        date
        status
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
      hasMore
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
  const { data, fetchNextPage, hasNextPage, isFetching } = useGraphqlQuery<EmailsQuery>({
    queryKey: ['emails', address],
    document: emails,
    variables: {
      address
    },
    suspense: true,
    getNextPageParam: (lastPage) =>
      lastPage.emailsPaginated.hasMore
        ? lastPage.emailsPaginated.items[lastPage.emailsPaginated.items.length - 1].createdAt
        : undefined,
    pageSize: 20
  })

  const flatData = data?.pages.flatMap((page) => page.emailsPaginated.items) ?? []

  if (data === undefined) {
    return null
  }

  if (data.pages[0].emailsPaginated.items.length === 0) {
    return (
      <Well style={{ flexGrow: '1', marginTop: '1rem' }}>
        <Title>No emails found</Title>
        <Paragraph>No emails for {address}</Paragraph>
      </Well>
    )
  }

  const mode = data.pages[0].emailsPaginated.items[0].id === 'eml_1' ? 'demo' : 'live'

  return (
    <InfiniteScroll
      dataLength={flatData.length}
      next={() => !isFetching && fetchNextPage()}
      hasMore={!!hasNextPage}
      loader={<Skeleton style={{ width: '100%', height: '8rem', marginTop: '1rem' }} />}
      endMessage={
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: 'GrayText' }}
        >
          <Span>—</Span>
        </div>
      }
    >
      <ZendeskTimeline>
        {mode === 'demo' && (
          <GlobalAlert type="info" style={{ marginTop: '1rem' }}>
            <GlobalAlert.Content>
              <Title>Demo mode</Title>
              <Paragraph>Emails below are examples.</Paragraph>
              <Paragraph>Complete app setup to see real emails:</Paragraph>
              <Paragraph>
                1.{' '}
                <a href="https://usetangle.com/?ref=za" target="_blank">
                  Sign up for Tangle
                </a>{' '}
                <Paragraph>2. Get an API key in your Tangle team settings</Paragraph>
                <Paragraph>3. Add the key in your Zendesk settings</Paragraph>
              </Paragraph>
            </GlobalAlert.Content>
          </GlobalAlert>
        )}
        {data.pages
          .flatMap((page) => page.emailsPaginated.items)
          .map((email, index) => (
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
                {!!email.status && (
                  <Row style={{ color: 'GrayText', display: 'block' }}>
                    <Span>
                      Email status: <EmailStatus status={email.status} />
                    </Span>
                  </Row>
                )}
                <Row style={{ color: 'GrayText' }}>
                  <Span>
                    Sent <EmailDate date={email.date} />{' '}
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
    </InfiniteScroll>
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
