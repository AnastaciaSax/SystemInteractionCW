// client/src/utils/uiSettings.ts

/**
 * Ключи localStorage, которые относятся к настройкам интерфейса (фильтры, сортировки и т.д.)
 * Эти настройки будут сбрасываться кнопкой Reset
 */
export const UI_SETTINGS_KEYS = {
  // Trade страница
  TRADE_ADS_FILTERS: 'tradeAdsFilters',
  TRADE_ADS_SORT: 'tradeAdsSort',
  
  // Wishlist страница
  WISHLIST_FILTERS: 'wishlistFilters',
  WISHLIST_SORT: 'wishlistSort',
  
  // Guide страница
  GUIDE_SEARCH_QUERY: 'guideSearchQuery',
  
  // Настройки UI
  UI_THEME: 'uiTheme',
  UI_LANGUAGE: 'uiLanguage',
  
  // Другие настройки интерфейса
  LAST_VISITED_PAGE: 'lastVisitedPage',
  DASHBOARD_LAYOUT: 'dashboardLayout',
  
  // Trade офферы
  TRADE_OFFERS_FILTERS: 'tradeOffersFilters',
};

/**
 * Ключи localStorage, которые НЕЛЬЗЯ очищать
 */
export const PRESERVED_KEYS = [
  'token',          // Токен авторизации
  'user',           // Данные пользователя
  'likedArticles',  // Лайкнутые статьи
  'chats',          // Данные чатов
  'forum_topics',   // Данные форума
  'forum_messages', // Сообщения форума
];

/**
 * Паттерны ключей, которые НЕЛЬЗЯ очищать
 */
export const PRESERVED_PATTERNS = [
  'chat_',          // Все ключи, начинающиеся с chat_
  'forum_',         // Все ключи, начинающиеся с forum_
];

/**
 * Сброс всех настроек интерфейса
 * Очищает только настройки UI, сохраняя важные данные
 */
export const resetUISettings = (): void => {
  console.log('🔄 Resetting UI settings...');
  
  // Собираем все ключи для очистки
  const keysToRemove: string[] = [];
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    // Проверяем, что это не важный ключ
    const isPreserved = PRESERVED_KEYS.includes(key) || 
                       PRESERVED_PATTERNS.some(pattern => key.startsWith(pattern));
    
    // Проверяем, что это не ключ с важными данными
    const isImportantData = key.includes('token') || 
                           key.includes('user') || 
                           key.includes('auth') ||
                           key.includes('forum') ||
                           key.includes('chat');
    
    if (!isPreserved && !isImportantData) {
      // Добавляем ключи с настройками UI
      if (
        Object.values(UI_SETTINGS_KEYS).includes(key) ||
        key.startsWith('ui_') ||
        key.includes('filter') ||
        key.includes('sort') ||
        key.includes('search') ||
        key.includes('preferences')
      ) {
        keysToRemove.push(key);
      }
    }
  });
  
  // Удаляем уникальные ключи (исправляем ошибку с Set)
  const uniqueKeys: string[] = [];
  keysToRemove.forEach(key => {
    if (!uniqueKeys.includes(key)) {
      uniqueKeys.push(key);
    }
  });
  
  // Удаляем каждый ключ
  uniqueKeys.forEach(key => {
    console.log(`🗑️ Removing setting: ${key}`);
    localStorage.removeItem(key);
  });
  
  console.log(`✅ Reset complete. Removed ${uniqueKeys.length} settings.`);
};

/**
 * Получить список всех настроек (для отладки)
 */
export const getAllUISettings = (): Record<string, any> => {
  const settings: Record<string, any> = {};
  
  Object.values(UI_SETTINGS_KEYS).forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        settings[key] = JSON.parse(value);
      } catch {
        settings[key] = value;
      }
    }
  });
  
  return settings;
};

/**
 * Сохранить настройку интерфейса
 */
export const saveUISetting = <T>(key: string, value: T): void => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Error saving UI setting:', error);
  }
};

/**
 * Загрузить настройку интерфейса
 */
export const loadUISetting = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('Error loading UI setting:', error);
    return defaultValue;
  }
};