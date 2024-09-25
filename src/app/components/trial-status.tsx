import { Suspense, useEffect, useState } from 'react'
import { graphql } from '@/gql/gql'
import { useGraphqlQuery } from '@/app/hooks/use-graphql-query'
import { DateTime } from 'luxon'
import { SubscriptionQuery, SubscriptionStatus } from '@/gql/graphql'
import { GlobalAlert, Paragraph, Title } from '@zendeskgarden/react-notifications'
import { Button } from '@zendeskgarden/react-buttons'
import { ErrorBoundary } from 'react-error-boundary'

const subscriptionQuery = graphql(`
  query subscription {
    subscription {
      status
      trialEndsAt
      hasPaymentMethod
    }
  }
`)

function TrialStatusContent() {
  const { data } = useGraphqlQuery<SubscriptionQuery>({
    queryKey: ['subscription'],
    document: subscriptionQuery,
    staleTime: 60 * 60 * 24 * 1000
  })

  const [hasDismissedTrialEndingAlert, setHasDismissedTrialEndingAlert] = useState(true)
  useEffect(() => {
    const dismissedTrialEndingAlertAt = localStorage.getItem('dismissedTrialEndingAlertAt')
    setHasDismissedTrialEndingAlert(
      !!dismissedTrialEndingAlertAt && DateTime.fromISO(dismissedTrialEndingAlertAt).diffNow('days').days > -3
    )
  }, [])

  const handleDismissTrialEndingAlert = () => {
    localStorage.setItem('dismissedTrialEndingAlertAt', DateTime.now().toISO())
    setHasDismissedTrialEndingAlert(true)
  }

  const subscription = data?.pages[0].subscription
  const isTrialEnding =
    subscription?.status === SubscriptionStatus.HasOngoingTrial &&
    DateTime.fromISO(subscription?.trialEndsAt).diffNow('days').days < 7

  return isTrialEnding && !subscription?.hasPaymentMethod && !hasDismissedTrialEndingAlert ? (
    <GlobalAlert type="info" style={{ marginBottom: '2rem', width: '100%' }}>
      <GlobalAlert.Content>
        <Title>
          <p>Trial ends {DateTime.fromISO(subscription?.trialEndsAt).toRelative()}</p>
        </Title>
        <Paragraph>
          Add a payment method before your trial ends to keep access to unlimited history, full message text, delivery
          status, and&nbsp;more.
        </Paragraph>
        <Paragraph>
          <Button onClick={() => window.open('https://usetangle.com/app?ref=zata', '_blank')} isPrimary>
            Add payment method
          </Button>
        </Paragraph>
      </GlobalAlert.Content>
      <GlobalAlert.Close aria-label="Close Button" onClick={handleDismissTrialEndingAlert} />
    </GlobalAlert>
  ) : null
}

export function TrialStatus() {
  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <TrialStatusContent />
      </Suspense>
    </ErrorBoundary>
  )
}
