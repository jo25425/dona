import { useTranslations } from 'next-intl';

export class AliasConfig {
    systemAlias: string;
    friendAlias: string;
    donorAlias: string;

    constructor(systemAlias: string, friendAlias: string, donorAlias: string) {
        this.systemAlias = systemAlias;
        this.friendAlias = friendAlias;
        this.donorAlias = donorAlias;
    }
}

let aliasConfig: AliasConfig | null = null;

export function useAliasConfig(): AliasConfig {
    const t = useTranslations("donation.anonymisation");
    if (!aliasConfig) {
        aliasConfig = new AliasConfig(t('system'), t('friend'), t('donor'));
    }
    return aliasConfig;
}

export function getAliasConfig(): AliasConfig {
    if (!aliasConfig) {
        throw new Error("AliasConfig has not been initialized yet.");
    }
    return aliasConfig;
}
