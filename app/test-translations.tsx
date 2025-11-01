import { getTranslation } from '../lib/i18n';

export default function TestTranslations() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Translation Test</h1>
      <div className="space-y-2">
        <p>{getTranslation('onboarding.messages.welcome')}</p>
        <p>{getTranslation('onboarding.messages.subtitle')}</p>
        <p>{getTranslation('common.loading')}</p>
      </div>
    </div>
  );
}