import { useTranslation } from 'react-i18next';
import SEOHead from "@/components/SEOHead";

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEOHead 
        title="Politique de confidentialité"
        description="Découvrez comment Étreintes Éphémères protège vos données personnelles. Notre politique de confidentialité détaille l'utilisation de vos informations."
        keywords="politique de confidentialité, protection des données, vie privée, étreintes éphémères"
        url="/privacy"
      />
      <div className="p-8 max-w-4xl mx-auto text-gray-700">
        <div className="w-full h-[200px]"></div>
        <h1 className="text-3xl font-bold mb-6">{t('privacyPolicy.title')}</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('privacyPolicy.section1')}</h2>
          <p>{t('privacyPolicy.intro')}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('privacyPolicy.section2')}</h2>
          <p>{t('privacyPolicy.dataCollected')}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('privacyPolicy.section3')}</h2>
          <p>{t('privacyPolicy.dataUsage')}</p>
          <ul className="list-disc pl-6">
            <li>{t('privacyPolicy.usageList.item1')}</li>
            <li>{t('privacyPolicy.usageList.item2')}</li>
            <li>{t('privacyPolicy.usageList.item3')}</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('privacyPolicy.section4')}</h2>
          <p>{t('privacyPolicy.dataSharing')}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('privacyPolicy.section5')}</h2>
          <p>{t('privacyPolicy.dataSecurity')}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('privacyPolicy.section6')}</h2>
          <p>{t('privacyPolicy.rights')}</p>
          <ul className="list-disc pl-6">
            <li>{t('privacyPolicy.rightsList.item1')}</li>
            <li>{t('privacyPolicy.rightsList.item2')}</li>
          </ul>
          <p>{t('privacyPolicy.contactInfo')}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('privacyPolicy.section7')}</h2>
          <p>{t('privacyPolicy.policyChanges')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">{t('privacyPolicy.contact')}</h2>
          <p>{t('privacyPolicy.contactDetails')}</p>
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicy;
  