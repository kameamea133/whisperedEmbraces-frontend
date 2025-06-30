import { useTranslation } from 'react-i18next';
import SEOHead from "@/components/SEOHead";

const Conditions = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEOHead 
        title="Conditions d'utilisation"
        description="Consultez les conditions d'utilisation d'Étreintes Éphémères. Règles et directives pour l'utilisation de notre plateforme de partage de poésie."
        keywords="conditions d'utilisation, règles, directives, étreintes éphémères, politique"
        url="/conditions"
      />
      <div className="p-8 max-w-4xl mx-auto flex flex-col text-gray-700 gap-9">
        <div className="w-full h-[200px]"></div>
        
        <h1 className="text-3xl font-bold mb-6">{t('conditions.title')}</h1>

        <section>
          <h2 className="text-xl font-semibold mb-2">{t('conditions.section1')}</h2>
          <p>{t('conditions.intro')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">{t('conditions.section2')}</h2>
          <p>{t('conditions.usage')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">{t('conditions.section3')}</h2>
          <p>{t('conditions.account')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">{t('conditions.section4')}</h2>
          <p>{t('conditions.intellectualProperty')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">{t('conditions.section5')}</h2>
          <p>{t('conditions.privacy')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">{t('conditions.section6')}</h2>
          <p>{t('conditions.liability')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">{t('conditions.section7')}</h2>
          <p>{t('conditions.modifications')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">{t('conditions.contact')}</h2>
          <p>{t('conditions.contactDetails')}</p>
        </section>
      </div>
    </>
  );
};

export default Conditions;
  