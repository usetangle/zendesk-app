import { Timeline as ZendeskTimeline } from '@zendeskgarden/react-accordions'
import { ErrorBoundary } from 'react-error-boundary'
import { graphql } from '@/gql/gql'
import { Col, Row } from '@zendeskgarden/react-grid'
import { EmailAddresses } from './email-address'
import { Span } from '@zendeskgarden/react-typography'
import { Button } from '@zendeskgarden/react-buttons'
import styled from 'styled-components'
import { useGraphqlQuery } from '@/app/hooks/use-graphql-query'
import { EmailsQuery } from '@/gql/graphql'
import { Suspense, useEffect } from 'react'
import { Skeleton } from '@zendeskgarden/react-loaders'
import { EmailDate } from './email-date'
import { Alert, GlobalAlert, Paragraph, Title, Well } from '@zendeskgarden/react-notifications'
import { EmailStatus } from './email-status'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useQueryClient } from '@tanstack/react-query'
import { useAnalytics } from '../hooks/use-analytics'

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
    getNextPageParam: (lastPage) =>
      lastPage.emailsPaginated.hasMore
        ? lastPage.emailsPaginated.items[lastPage.emailsPaginated.items.length - 1].createdAt
        : undefined,
    pageSize: 20
  })

  const analytics = useAnalytics()
  useEffect(() => {
    analytics.track('Zendesk Timeline Viewed', {
      address,
      firstPageResultCount: data?.pages[0].emailsPaginated.items.length
    })
  }, [analytics, address])

  const flatData = data?.pages.flatMap((page) => page.emailsPaginated.items) ?? []

  if (flatData.length === 0) {
    return (
      <Well style={{ flexGrow: '1', marginTop: '1rem' }}>
        <Title>No emails found</Title>
        <Paragraph>No emails for {address}</Paragraph>
      </Well>
    )
  }

  const mode = flatData[0].id === 'eml_1' ? 'demo' : 'live'

  return (
    <InfiniteScroll
      dataLength={flatData.length}
      next={() => {
        if (!isFetching) {
          fetchNextPage()
          analytics.track('Zendesk Timeline Loaded More', { address })
        }
      }}
      hasMore={!!hasNextPage}
      loader={<TimelineSkeleton />}
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
        {flatData.map((email) => (
          <StyledTimelineItem key={email.id}>
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

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <Alert type="error" style={{ width: '100%' }}>
      {!!error.message && <Title>{error.message}</Title>}
      <Paragraph>An error occurred while loading the timeline.</Paragraph>
      <Button onClick={resetErrorBoundary} isDanger style={{ marginTop: '1rem' }}>
        Retry
      </Button>
    </Alert>
  )
}

export default function Timeline({
  address,
  emailViewHandler
}: {
  address: string
  emailViewHandler: (params: URLSearchParams) => void
}) {
  const queryClient = useQueryClient()
  const refetch = () => {
    queryClient.refetchQueries({ queryKey: ['emails', address] })
  }
  return (
    <ErrorBoundary onReset={refetch} key={address} FallbackComponent={ErrorFallback}>
      <Suspense fallback={<TimelineSkeleton />}>
        {address !== '' && <TimelineContent address={address} emailViewHandler={emailViewHandler} />}
      </Suspense>
    </ErrorBoundary>
  )
}
