import { Suspense, useEffect, useState } from 'react'
import { graphql } from '@/gql/gql'
import { useGraphqlQuery } from '@/app/hooks/use-graphql-query'
import { DateTime } from 'luxon'
import { StatusQuery, SubscriptionStatus } from '@/gql/graphql'
import { GlobalAlert, Paragraph, Title } from '@zendeskgarden/react-notifications'
import { Button } from '@zendeskgarden/react-buttons'
import { ErrorBoundary } from 'react-error-boundary'

const subscriptionQuery = graphql(`
  query status {
    subscription {
      status
      trialEndsAt
      hasPaymentMethod
    }
    mode {
      isDemo
    }
  }
`)

function UpgradeContent() {
  const { data } = useGraphqlQuery<StatusQuery>({
    queryKey: ['status'],
    document: subscriptionQuery,
    staleTime: 60 * 60 * 24 * 1000
  })

  const subscription = data?.pages[0].subscription
  const isDemo = data?.pages[0].mode?.isDemo

  return subscription?.status === SubscriptionStatus.HasNoOngoingSubscription && !isDemo ? (
    <GlobalAlert type="info" style={{ marginTop: '2rem', width: '100%' }}>
      <GlobalAlert.Content>
        <Title>
          <p>Up to 7 days of history available</p>
        </Title>
        <Paragraph>Get access to unlimited history, full message text, delivery status, and&nbsp;more.</Paragraph>
        <Paragraph>
          <Button onClick={() => window.open('https://usetangle.com/app?ref=zata', '_blank')} isPrimary>
            Upgrade
          </Button>
        </Paragraph>
      </GlobalAlert.Content>
    </GlobalAlert>
  ) : null
}

export function Upgrade() {
  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <UpgradeContent />
      </Suspense>
    </ErrorBoundary>
  )
}
