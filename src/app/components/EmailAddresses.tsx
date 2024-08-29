import { EmailAddress as Address } from '@/gql/graphql'
import { Tooltip } from '@zendeskgarden/react-tooltips'

interface PartialAddressObject {
  value: Address[]
}

interface EmailAddressesProps {
  emails: PartialAddressObject | PartialAddressObject[]
}

export function EmailAddresses({ emails }: EmailAddressesProps) {
  if (!emails) return null

  if (Array.isArray(emails)) {
    return emails.map(renderAddressObject)
  }
  return renderAddressObject(emails)
}

const renderAddressObject = (addressObject: PartialAddressObject) => addressObject?.value.map(renderEmailAddress)

const renderEmailAddress = (address: Address) => (
  <Tooltip
    hasArrow
    size="medium"
    zIndex={10}
    key={address.address}
    content={<span style={{ fontWeight: 'bold' }}>{address.address}</span>}
  >
    <span style={{ fontWeight: '500' }}>{address.name || address.address}</span>
  </Tooltip>
)
