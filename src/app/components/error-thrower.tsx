import React from 'react'

const ErrorThrower: React.FC = () => {
  throw new Error('Forced error for testing purposes')
}

export default ErrorThrower
