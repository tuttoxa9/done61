import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Интерфейс для данных заявки
export interface ApplicationData {
  fullName: string;
  birthDate: string;
  phone: string;
  source?: string; // откуда пришла заявка (какая форма)
  userAgent?: string;
  referrer?: string;
}

// Интерфейс для сохраненной заявки в Firebase
export interface SavedApplication extends ApplicationData {
  id: string;
  createdAt: any; // Firebase Timestamp
  status: 'new' | 'contacted' | 'hired' | 'rejected';
}

/**
 * Отправляет заявку в Firebase Firestore
 */
export async function submitApplication(data: ApplicationData): Promise<string> {
  try {
    // Добавляем дополнительную информацию
    const applicationData = {
      ...data,
      createdAt: serverTimestamp(),
      status: 'new' as const,
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
    };

    // Сохраняем в коллекцию 'unic'
    const docRef = await addDoc(collection(db, 'unic'), applicationData);

    console.log('Application submitted with ID: ', docRef.id);

    return docRef.id;
  } catch (error) {
    console.error('Error submitting application: ', error);
    throw error;
  }
}

/**
 * Отправляет заявку в Firebase и дублирует в Telegram (через существующую функцию)
 */
export async function submitApplicationWithTelegram(data: ApplicationData): Promise<{
  firebaseId: string;
  telegramSent: boolean;
}> {
  try {
    // Сначала сохраняем в Firebase
    const firebaseId = await submitApplication(data);

    let telegramSent = false;

    // Затем пытаемся отправить в Telegram через существующую функцию
    try {
      const response = await fetch('/.netlify/functions/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          birthDate: data.birthDate,
          phone: data.phone
        }),
      });

      telegramSent = response.ok;

      if (!response.ok) {
        console.warn('Failed to send to Telegram, but saved to Firebase');
      }
    } catch (telegramError) {
      console.warn('Telegram notification failed, but saved to Firebase:', telegramError);
    }

    return { firebaseId, telegramSent };
  } catch (error) {
    console.error('Error in submitApplicationWithTelegram:', error);
    throw error;
  }
}
