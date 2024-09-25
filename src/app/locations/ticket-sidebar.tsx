import { useEffect, useState } from 'react'
import { useClient } from '../hooks/use-client'
import { Grid, Row } from '@zendeskgarden/react-grid'
import styled from 'styled-components'
import Timeline from '../components/timeline'
import Search from '../components/search'
import { graphql } from '@/gql/gql'
import { useGraphqlQuery } from '@/app/hooks/use-graphql-query'
import { SubscriptionQuery, SubscriptionStatus } from '@/gql/graphql'
import { Alert, GlobalAlert, Paragraph, Title } from '@zendeskgarden/react-notifications'
import { DateTime } from 'luxon'
import { Button } from '@zendeskgarden/react-buttons'

const TicketSideBar = () => {
  const client = useClient()
  const [searchTerm, setSearchTerm] = useState<string>('')
  useEffect(() => {
    const getRequester = async () => {
      const requester = await client.get('ticket.requester')
      setSearchTerm(requester['ticket.requester'].email)
    }
    getRequester()
  }, [client])

  const handleNewInstance = (params?: URLSearchParams) => {
    client.invoke('instances.create', {
      location: 'modal',
      url: `${import.meta.env.VITE_ZENDESK_LOCATION}?${params?.toString()}`,
      size: {
        width: '650px',
        height: '400px'
      }
    })
  }

  useEffect(() => {
    client.invoke('resize', { width: '100%', height: '550px' })
  }, [client])

  const subscriptionQuery = graphql(`
    query subscription {
      subscription {
        status
        cancelAtPeriodEnd
        currentPeriodEndsAt
        trialEndsAt
        hasPaymentMethod
      }
    }
  `)
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
    DateTime.fromISO(subscription?.trialEndsAt).diffNow('days').days < 14
  return (
    <GridContainer>
      <>
        <Row>
          {isTrialEnding && !subscription?.hasPaymentMethod && !hasDismissedTrialEndingAlert && (
            <GlobalAlert type="info" style={{ marginBottom: '2rem', width: '100%' }}>
              <GlobalAlert.Content>
                <Title>
                  <p>Trial ends {DateTime.fromISO(subscription?.trialEndsAt).toRelative()}</p>
                </Title>
                <Paragraph>
                  Add a payment method before your trial ends to keep access to unlimited history, full message text,
                  delivery status, and&nbsp;more.
                </Paragraph>
                <Paragraph>
                  <Button onClick={() => window.open('https://usetangle.com/app?ref=zata', '_blank')} isPrimary>
                    Add payment method
                  </Button>
                </Paragraph>
              </GlobalAlert.Content>
              <GlobalAlert.Close aria-label="Close Button" onClick={handleDismissTrialEndingAlert} />
            </GlobalAlert>
          )}
        </Row>
        <Row>
          <Search
            initialSearch={searchTerm}
            onSubmit={setSearchTerm}
            style={{
              width: '100%',
              position: 'sticky',
              top: '0',
              backgroundColor: 'white',
              zIndex: 10,
              paddingBottom: '10px'
            }}
          />
          <Timeline address={searchTerm} emailViewHandler={handleNewInstance} />
        </Row>
        <Row></Row>
      </>
    </GridContainer>
  )
}

const GridContainer = styled(Grid)`
  display: grid;
`

export default TicketSideBar
