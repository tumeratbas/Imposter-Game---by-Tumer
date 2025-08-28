# Imposter Web App - Next.js + Firebase (MVP)

Basit, deploy edilebilir Imposter (imposter game) web uygulaması.

## Özet
- Next.js + Firebase Firestore kullanır (client-side).
- Oda oluşturma, oyuncuların katılması, liderin ana kelime ve decoy kelime girmesi.
- Rastgele bir imposter atanır; imposter'a decoy gösterilir.

## Kurulum (yerel)
1. Node.js (LTS) yükleyin.
2. Bu repo'yu klonlayın veya zip'i açın.
3. `.env.local` dosyasını oluşturun ve Firebase config değerlerini ekleyin:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

4. Bağımlılıkları kur:
```
npm install
npm run dev
```
5. Tarayıcıda `http://localhost:3000` açın.

## Deploy
- GitHub'a push edin ve Vercel'e import ederek deploy edin.
- Vercel proje ayarlarında aynı environment variable'ları ekleyin.

## Notlar
- Firebase'de Firestore ve Authentication (Anonymous) aktifleştirin.
- Test aşamasında Firestore'u test modda açabilirsiniz; üretim için güvenlik kurallarını sıkılaştırın.
