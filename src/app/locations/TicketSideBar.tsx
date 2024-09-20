import { useEffect, useState } from 'react'
import { useClient } from '../hooks/useClient'
import { Grid, Row } from '@zendeskgarden/react-grid'
import { MD, SM, Span } from '@zendeskgarden/react-typography'
import styled from 'styled-components'
import Timeline from '../components/timeline'
import { Requester } from '@/types/zendesk'

const TicketSideBar = () => {
  const client = useClient()
  const [requester, setRequester] = useState<Requester | undefined>(undefined)
  useEffect(() => {
    const getRequester = async () => {
      const requester = await client.get('ticket.requester')
      setRequester(requester['ticket.requester'])
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
    client.invoke('resize', { width: '100%', height: '450px' })
  }, [client])

  return (
    <GridContainer>
      {requester && (
        <>
          <Row>
            <MD style={{ fontWeight: '600' }}>{requester.name}</MD>
          </Row>
          <Row>
            <SM style={{ color: 'GrayText' }}>
              Emails for <Span style={{ fontWeight: '500' }}>{requester.email}</Span>
            </SM>
          </Row>
          <Row>
            <Timeline address={requester.email} emailViewHandler={handleNewInstance} />
          </Row>
        </>
      )}
    </GridContainer>
  )
}

const GridContainer = styled(Grid)`
  display: grid;
`

export default TicketSideBar
