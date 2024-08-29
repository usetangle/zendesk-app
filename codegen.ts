import { CodegenConfig } from '@graphql-codegen/cli'

if (!process.env.VITE_TANGLE_API_BASE_URL) {
  throw new Error('Set VITE_TANGLE_API_BASE_URL env var to run codegen')
}

if (!process.env.VITE_TANGLE_API_KEY) {
  throw new Error('Set VITE_TANGLE_API_KEY env var to run codegen')
}

const config: CodegenConfig = {
  schema: {
    [`${process.env.VITE_TANGLE_API_BASE_URL}/graphql`]: {
      headers: {
        'X-API-Key': process.env.VITE_TANGLE_API_KEY
      }
    }
  },
  documents: ['src/**/*.tsx', '!src/gql/**/*'],
  ignoreNoDocuments: true,
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: []
    },
    // schema is for the graphql-sp plugin
    './src/schema/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true
      }
    }
  }
}

export default config
