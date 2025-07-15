'use client';

import { Switch } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { useRouter } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(i18n.language === 'en');
  const router = useRouter();

  const handleLanguageChange = (checked) => {
    const newLang = checked ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
    setChecked(checked);
    document.cookie = `lang=${newLang}; path=/`;
    router.refresh();
  };

  return (
    <Switch
      checked={checked}
      onChange={handleLanguageChange}
      checkedChildren="EN"
      unCheckedChildren="VI"
      size="medium"
      className="bg-gray-200"
    />
  );
}
