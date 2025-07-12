'use client';

import '@ant-design/v5-patch-for-react-19';
import { Switch } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';  // Để chuyển hướng khi thay đổi ngôn ngữ

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [checked, setChecked] = useState(i18n.language === 'en');  // Kiểm tra ngôn ngữ hiện tại

  const router = useRouter();

  // Hàm đổi ngôn ngữ
  const handleLanguageChange = (checked) => {
    const newLang = checked ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
    setChecked(checked);

    // Lưu trữ ngôn ngữ vào cookie (hoặc bất kỳ nơi lưu trữ nào bạn muốn)
    document.cookie = `lang=${newLang}; path=/`;

    // Chuyển hướng lại trang hiện tại sau khi thay đổi ngôn ngữ
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onChange={handleLanguageChange} />
    </div>
  );
}
