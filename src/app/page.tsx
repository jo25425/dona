import {useTranslations} from 'next-intl';

export default function HomePage() {
    const t = useTranslations('landing');
    return (
        <div>
            <h1>{t('what.title')}</h1>
            <p>{t('what.body1')}</p>
            <p>{t('what.body2')}</p>
        </div>
    );
}