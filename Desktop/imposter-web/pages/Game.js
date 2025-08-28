import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { useRouter } from 'next/router';

// Kelime listesi: 300 ana kelime + decoy
const words = [
  ["havuç","tavşan"], ["elma","ağaç"], ["araba","tekerlek"], ["kalem","defter"], ["deniz","kum"],
  // ... kalan 295 kelimeyi aynı formatta ekle
];

export default function Games() {
  const router = useRouter();
  const { roomId } = router.query;
  const [uid, setUid] = useState('');
  const [role, setRole] = useState('');
  const [word, setWord] = useState('');
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    if (!roomId) return;
    signInAnonymously(auth).then(userCredential => setUid(userCredential.user.uid));
  }, [roomId]);

  async function joinRoom() {
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomRef);
    if (!roomSnap.exists()) {
      await setDoc(roomRef, { players: [{ uid }], started: false });
    } else {
      const players = roomSnap.data().players || [];
      if (!players.find(p => p.uid === uid)) {
        players.push({ uid });
        await updateDoc(roomRef, { players });
      }
    }
  }

  function pickRandomWord() {
    const idx = Math.floor(Math.random() * words.length);
    return { main: words[idx][0], decoy: words[idx][1] };
  }

  async function startGame() {
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomRef);
    if (!roomSnap.exists()) return;
    const players = roomSnap.data().players;
    if (players.length < 4) return alert('Minimum 4 oyuncu gerekiyor');

    const wordObj = pickRandomWord();
    const impIndex = Math.floor(Math.random() * players.length);

    const roles = {};
    players.forEach((p, idx) => {
      roles[p.uid] = idx === impIndex ? 'imposter' : 'normal';
    });

    await updateDoc(roomRef, {
      started: true,
      mainWord: wordObj.main,
      decoyWord: wordObj.decoy,
      roles,
      order: players.map(p => p.uid),
      revealed: {}
    });
  }

  useEffect(() => {
    if (!roomId) return;
    const interval = setInterval(async () => {
      const roomRef = doc(db, 'rooms', roomId);
      const roomSnap = await getDoc(roomRef);
      if (roomSnap.exists()) {
        setRoomData(roomSnap.data());
        const r = roomSnap.data().roles?.[uid];
        setRole(r || '');
        if (r === 'imposter') setWord(roomSnap.data().decoyWord);
        else setWord(roomSnap.data().mainWord);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [uid, roomId]);

  if (!roomId) return <p>Oda ID yükleniyor...</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Oda: {roomId}</h1>
      <button onClick={joinRoom} style={{ margin: '10px', padding: '10px 20px' }}>Odaya Katıl</button>
      <button onClick={startGame} style={{ margin: '10px', padding: '10px 20px' }}>Oyunu Başlat</button>
      <p>Rolünüz: {role}</p>
      {word && <p>Kelimeniz: {word}</p>}
    </div>
  );
}
