import { formatDate } from '@/lib/date-format'
import { Tooltip } from '@zendeskgarden/react-tooltips'
import { Span } from '@zendeskgarden/react-typography'

export const EmailDate = ({ date, absolute = false }: { date: string; absolute?: boolean }) => {
  return (
    <Tooltip
      hasArrow
      size="medium"
      zIndex={10}
      content={
        <>
          <Span>{formatDate(date)}</Span>
          <br />
          <Span>{formatDate(date, 'relative')}</Span>
        </>
      }
    >
      <Span>{formatDate(date, absolute ? 'absolute' : 'relative-within-day')}</Span>
    </Tooltip>
  )
}
