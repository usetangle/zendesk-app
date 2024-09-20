import { EmailStatusEnum } from '@/gql/graphql'
import { Tooltip } from '@zendeskgarden/react-tooltips'

const statusDescriptions = {
  [EmailStatusEnum.Drafted]: 'The email has been drafted but not sent',
  [EmailStatusEnum.Attempted]: 'The email could not be sent to the delivery provider and will be retried',
  [EmailStatusEnum.Sent]: 'The email was sent but not yet delivered to the recipient',
  [EmailStatusEnum.Delivered]: 'The email was successfully delivered to the recipient',
  [EmailStatusEnum.Opened]: 'The recipient opened the email',
  [EmailStatusEnum.Clicked]: 'The recipient clicked a tracked link in the email',
  [EmailStatusEnum.Converted]: 'The person matched a conversion goal attributed to the email',
  [EmailStatusEnum.Unsubscribed]: 'The recipient unsubscribed based on this email',
  [EmailStatusEnum.Bounced]: "The delivery provider could not deliver the email and it won't be retried",
  [EmailStatusEnum.Dropped]: 'The email was not sent because it was addressed to a person who was suppressed',
  [EmailStatusEnum.Spammed]: 'The recipient marked the email as spam',
  [EmailStatusEnum.Failed]: 'The email could not be sent to the delivery provider',
  [EmailStatusEnum.Undeliverable]:
    'Undeliverable messages are messages that have either hit a message limit, come from a newsletter that was cancelled or deleted, or an environment that has delivery disabled'
}

export function EmailStatus({ status }: { status: EmailStatusEnum }) {
  return (
    <Tooltip
      hasArrow
      size="medium"
      zIndex={10}
      content={<span>{statusDescriptions[status as keyof typeof statusDescriptions]}</span>}
    >
      <span style={{ textTransform: 'lowercase', fontWeight: '500' }}>{status}</span>
    </Tooltip>
  )
}
