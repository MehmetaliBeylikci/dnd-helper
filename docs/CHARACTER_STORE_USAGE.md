# Karakter Store Kullanım Kılavuzu

## Genel Bakış

`useCharacterStore` Zustand ile oluşturulmuş merkezi karakter yönetim store'udur. LocalStorage'a otomatik kaydeder ve önceden hazırlanmış Fighter/Wizard/Rogue/Cleric şablonları içerir.

## Temel Kullanım

### Store'a Erişim

```typescript
import { useCharacterStore } from "../store/characterStore";

function MyComponent() {
  // Tüm karakterleri al
  const characters = useCharacterStore((state) => state.characters);

  // Seçili karakter ID'sini al
  const selectedId = useCharacterStore((state) => state.selectedCharacterId);

  // Belirli bir aksiyonu al
  const addCharacter = useCharacterStore((state) => state.addCharacter);
}
```

### Şablon ile Karakter Oluştürma

```typescript
import { useCharacterStore } from '../store/characterStore';

function TemplateExample() {
  const loadFromTemplate = useCharacterStore((state) => state.loadCharacterFromTemplate);

  const createFighter = async () => {
    // Fighter şablonundan karakter oluştur
    const character = await loadFromTemplate('fighter', 'Aragorn');
    console.log('Fighter created:', character);
    // Otomatik olarak IndexedDB'ye kaydedilir ve store'a eklenir
  };

  const createWizard = async () => {
    // Wizard şablonundan karakter oluştur
    const character = await loadFromTemplate('wizard', 'Gandalf');
    console.log('Wizard created:', character);
  };

  return (
    <div>
      <button onClick={createFighter}>Create Fighter</button>
      <button onClick={createWizard}>Create Wizard</button>
    </div>
  );
}
```

## Mevcut Şablonlar

### 1. Fighter (Savaşçı)

```typescript
{
  class: 'Fighter',
  subclass: 'Champion',
  abilityScores: {
    strength: 16,     // Primary
    constitution: 15, // HP
    dexterity: 14,    // AC
  },
  hitPoints: { max: 12 },  // d10 + CON
  armorClass: 18,          // Chain mail + DEX
  skills: ['Athletics', 'Intimidation'],
  saves: ['strength', 'constitution']
}
```

### 2. Wizard (Büyücü)

```typescript
{
  class: 'Wizard',
  subclass: 'School of Evocation',
  abilityScores: {
    intelligence: 16,  // Primary
    constitution: 13,  // HP
    dexterity: 14,     // AC
  },
  hitPoints: { max: 7 },   // d6 + CON
  armorClass: 12,          // 10 + DEX
  skills: ['Arcana', 'History', 'Investigation'],
  saves: ['intelligence', 'wisdom']
}
```

### 3. Rogue (Hırsız)

```typescript
{
  class: 'Rogue',
  subclass: 'Thief',
  abilityScores: {
    dexterity: 17,     // Primary
    constitution: 14,  // HP
    intelligence: 13,
  },
  hitPoints: { max: 10 },  // d8 + CON
  armorClass: 15,          // Leather + DEX
  skills: ['Stealth', 'Sleight of Hand', 'Deception', 'Acrobatics'],
  saves: ['dexterity', 'intelligence']
}
```

### 4. Cleric (Rahip)

```typescript
{
  class: 'Cleric',
  subclass: 'Life Domain',
  abilityScores: {
    wisdom: 16,        // Primary
    constitution: 15,  // HP
    strength: 14,
  },
  hitPoints: { max: 10 },  // d8 + CON
  armorClass: 18,          // Chain mail + shield
  skills: ['Medicine', 'Religion'],
  saves: ['wisdom', 'charisma']
}
```

## Store Aksiyonları

### setCharacters

Karakter listesini toplu olarak ayarla:

```typescript
const setCharacters = useCharacterStore((state) => state.setCharacters);
setCharacters([character1, character2]);
```

### selectCharacter

Aktif karakteri seç:

```typescript
const selectCharacter = useCharacterStore((state) => state.selectCharacter);
selectCharacter("character-id-123");
```

### addCharacter

Yeni karakter ekle:

```typescript
const addCharacter = useCharacterStore((state) => state.addCharacter);
addCharacter(newCharacter);
```

### updateCharacter

Mevcut karakteri güncelle:

```typescript
const updateCharacter = useCharacterStore((state) => state.updateCharacter);
updateCharacter("character-id", {
  hitPoints: { ...character.hitPoints, current: 20 },
});
```

### deleteCharacter

Karakteri sil:

```typescript
const deleteCharacter = useCharacterStore((state) => state.deleteCharacter);
deleteCharacter("character-id");
```

### loadCharacterFromTemplate

Şablondan karakter oluştur (async):

```typescript
const loadFromTemplate = useCharacterStore(
  (state) => state.loadCharacterFromTemplate,
);
const newCharacter = await loadFromTemplate("fighter", "Custom Name");
```

## LocalStorage Persistence

Store otomatik olarak şu verileri LocalStorage'a kaydeder:

- `selectedCharacterId` - Seçili karakter ID'si

**Not:** Karakter verileri ayrı olarak IndexedDB'de `characterStorage` ile saklanır (daha büyük veri kapasitesi için).

### LocalStorage Key

```
dnd-character-storage
```

### Verileri Temizleme

```typescript
localStorage.removeItem("dnd-character-storage");
```

## Template Selector Komponenti

Hazır UI komponenti ile kullanım:

```typescript
import { TemplateSelector } from '../components/character/TemplateSelector';

function CharacterCreation() {
  return (
    <div>
      <h1>Create Character</h1>
      <TemplateSelector />
      {/* Kullanıcı şablon seçer,otomatik olarak karakter oluşturulur */}
    </div>
  );
}
```

## Hooks ile Kullanım

### Seçili Karakteri Al

```typescript
function CharacterDisplay() {
  const characters = useCharacterStore((state) => state.characters);
  const selectedId = useCharacterStore((state) => state.selectedCharacterId);

  const selectedCharacter = characters.find(c => c.id === selectedId);

  if (!selectedCharacter) return <div>No character selected</div>;

  return <div>{selectedCharacter.name}</div>;
}
```

### Karakter Sayısı

```typescript
const characterCount = useCharacterStore((state) => state.characters.length);
```

### Belirli Sınıfı Filtrele

```typescript
const fighters = useCharacterStore((state) =>
  state.characters.filter((c) => c.class === "Fighter"),
);
```

## Örnekler

### Hızlı Başlangıç Uygulaması

```typescript
import { useEffect } from 'react';
import { useCharacterStore } from '../store/characterStore';
import { characterStorage } from '../lib/storage';
import { TemplateSelector } from '../components/character/TemplateSelector';

function App() {
  const { characters, setCharacters, selectedCharacterId } = useCharacterStore();

  // İlk yüklemede karakterleri IndexedDB'den al
  useEffect(() => {
    (async () => {
      const loadedChars = await characterStorage.getAll();
      setCharacters(loadedChars);
    })();
  }, []);

  // Eğer karakter yoksa, şablon seçiciyi göster
  if (characters.length === 0) {
    return <TemplateSelector />;
  }

  const selected = characters.find(c => c.id === selectedCharacterId);

  return (
    <div>
      <h1>{selected?.name || 'Select a character'}</h1>
      <CharacterSheet character={selected} />
    </div>
  );
}
```

### Karakter HP Güncelleme

```typescript
function HealButton({ characterId }: { characterId: string }) {
  const updateCharacter = useCharacterStore((state) => state.updateCharacter);
  const character = useCharacterStore((state) =>
    state.characters.find(c => c.id === characterId)
  );

  const heal = () => {
    if (!character) return;

    const newHp = Math.min(
      character.hitPoints.current + 10,
      character.hitPoints.max
    );

    updateCharacter(characterId, {
      hitPoints: {
        ...character.hitPoints,
        current: newHp,
      },
    });

    // IndexedDB'ye de kaydet
    characterStorage.update(characterId, {
      hitPoints: { ...character.hitPoints, current: newHp },
    });
  };

  return <button onClick={heal}>Heal +10 HP</button>;
}
```

## Veri Akışı

1. **İlk Yükleme**: App başlarken `characterStorage.getAll()` ile karakterler yüklenir
2. **Store Güncelleme**: `setCharacters()` ile store doldurulur
3. **Kullanıcı Aksiyonu**: Component'ler store aksiyonlarını çağırır
4. **Persist**: Zustand otomatik olarak `selectedCharacterId`'yi LocalStorage'a kaydeder
5. **IndexedDB**: Karakter verileri `characterStorage` ile manuel kaydedilir

## Avantajlar

- ✅ **Otomatik Persist**: LocalStorage'a otomatik kayıt
- ✅ **Tip Güvenliği**: Full TypeScript desteği
- ✅ **Hazır Şablonlar**: Fighter, Wizard, Rogue, Cleric
- ✅ **Performans**: Zustand hafif ve hızlı
- ✅ **IndexedDB**: Büyük veri için LocalForage entegrasyonu
- ✅ **Devtools**: Redux DevTools desteği (geliştirme için)

## Sorun Giderme

**S: LocalStorage temizlense de karakterler kalıyor**  
C: Karakterler IndexedDB'de saklanır. Tam temizleme için: `characterStorage.deleteAll()`

**S: Şablondan oluşturduğum karakter görünmüyor**  
C: `loadCharacterFromTemplate` async'tir, await kullandığınızdan emin olun.

**S: Store güncellenmiyor**  
C: React component'in içinden store'u kullandığınızdan emin olun. Hook kurallarına uyun.
