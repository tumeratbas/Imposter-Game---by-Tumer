import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  function createRoom() {
    const roomId = Math.random().toString(36).substring(2, 8); // 6 haneli oda kodu
    router.push(`/Games/${roomId}`);
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Imposter Oyunu</h1>
      <button onClick={createRoom} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Oda Oluştur / Katıl
      </button>
    </div>
  );
}
