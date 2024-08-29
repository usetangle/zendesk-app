class I18n {
  private translations: Record<string, string>

  constructor() {
    this.translations = {}
  }

  static getRetries(locale: string) {
    return [locale, locale.replace(/-.+$/, ''), 'en']
  }

  tryRequire = async (locale: string) => {
    try {
      const result = await import(`../translations/${locale}.json`)
      return result
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return null
    }
  }

  loadTranslations = async (locale: string) => {
    const intentLocales = I18n.getRetries(locale)

    do {
      try {
        const importedTranslations = await this.tryRequire(intentLocales[0])
        if (importedTranslations.default) {
          this.translations = importedTranslations.default
          break
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        intentLocales.shift()
      }
    } while (intentLocales.length)
  }

  t = (key: string, context: Record<string, string> = {}) => {
    const keyType = typeof key
    if (keyType !== 'string') throw new Error(`Translation key must be a string, got: ${keyType}`)

    const template = this.translations[key]
    if (!template) throw new Error(`Missing translation: ${key}`)
    if (typeof template !== 'string') throw new Error(`Invalid translation for key: ${key}`)

    return template.replace(/{{(.*?)}}/g, (_, match) => context[match] || '')
  }
}

export default I18n
