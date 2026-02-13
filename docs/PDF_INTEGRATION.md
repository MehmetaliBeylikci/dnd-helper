# PDF Character Sheet Integration

## Overview

The PDF service allows automatic filling of D&D 5E character sheet PDF templates with character data from the application.

## Features

- 📄 **PDF Field Scanning**: Automatically discover all form fields in a PDF template
- 🗺️ **Automatic Mapping**: 70+ pre-configured field mappings for standard D&D sheets
- 📊 **Character Data Export**: Fill PDFs with ability scores, skills, saves, combat stats
- 🔍 **Inspector Tool**: Developer tool to analyze templates and find unmapped fields
- 💾 **Download & Preview**: Export filled PDFs or preview in browser

## Usage

### 1. Upload PDF Template

```typescript
import { PdfExport } from './components/character/PdfExport';

<PdfExport character={myCharacter} />
```

User uploads a D&D 5E character sheet PDF (e.g., official WotC sheet).

### 2. Automatic Field Detection

The service scans the PDF and finds all fillable form fields:

```typescript
const fields = await scanPdfFields(pdfBytes);
// Returns: ['CharacterName', 'STR', 'DEX', 'AC', ...]
```

### 3. Data Mapping

Fields are automatically mapped to character properties:

| PDF Field       | Maps To                            | Example   |
| --------------- | ---------------------------------- | --------- |
| `CharacterName` | `character.name`                   | "Aragorn" |
| `STR`           | `character.abilityScores.strength` | "16"      |
| `STRmod`        | Auto-calculated modifier           | "+3"      |
| `AC`            | `character.armorClass`             | "15"      |
| `Acrobatics`    | Skill + proficiency                | "+5"      |

### 4. Export

```typescript
const filledPdf = await fillCharacterSheet(pdfBytes, character);
downloadPdf(filledPdf, "Aragorn_Character_Sheet.pdf");
```

## Supported PDF Fields

### Basic Info (9 fields)

- CharacterName, Class, Subclass, Level, Race, Background, Alignment
- PlayerName, ExperiencePoints

### Ability Scores (12 fields)

- STR, STRmod, DEX, DEXmod, CON, CONmod
- INT, INTmod, WIS, WISmod, CHA, CHAmod

### Combat Stats (6 fields)

- AC (Armor Class)
- Initiative
- Speed
- HPMax, HPCurrent, HPTemp
- ProfBonus (Proficiency Bonus)

### Saving Throws (6 fields)

- ST Strength, ST Dexterity, ST Constitution
- ST Intelligence, ST Wisdom, ST Charisma
- _Automatically adds proficiency bonus if proficient_

### Skills (18 fields)

All D&D 5E skills with automatic proficiency calculation:

- Acrobatics (DEX), Animal Handling (WIS), Arcana (INT)
- Athletics (STR), Deception (CHA), History (INT)
- Insight (WIS), Intimidation (CHA), Investigation (INT)
- Medicine (WIS), Nature (INT), Perception (WIS)
- Performance (CHA), Persuasion (CHA), Religion (INT)
- Sleight of Hand (DEX), Stealth (DEX), Survival (WIS)

### Special

- Passive Perception (auto-calculated: 10 + WIS mod + Prof if proficient)

## API Reference

### `scanPdfFields(pdfBytes)`

Scans a PDF and returns all form field names.

```typescript
const fields: string[] = await scanPdfFields(arrayBuffer);
```

### `fillCharacterSheet(pdfBytes, character)`

Fills a PDF template with character data.

```typescript
const filledPdf: Uint8Array = await fillCharacterSheet(
  templateBytes,
  character,
);
```

### `getUnmappedFields(pdfBytes)`

Returns fields that exist in PDF but lack mappings.

```typescript
const unmapped: string[] = await getUnmappedFields(arrayBuffer);
console.log("Add these to PDF_FIELD_MAPPING:", unmapped);
```

### `downloadPdf(pdfBytes, filename)`

Triggers browser download of PDF.

```typescript
downloadPdf(filledPdf, "character.pdf");
```

### `previewPdf(pdfBytes)`

Opens PDF in new browser tab.

```typescript
previewPdf(filledPdf);
```

## Adding Custom Field Mappings

Edit `src/services/pdfService.ts`:

```typescript
export const PDF_FIELD_MAPPING = {
  // ... existing mappings ...

  // Add your custom field
  CustomFieldName: (char: Character) => char.someProperty,

  // Dynamic calculation example
  TotalWeight: (char: Character) => {
    // Calculate based on inventory
    return "45 lbs";
  },
};
```

## Developer Tool: PDF Inspector

Use the `PdfInspector` component to analyze templates:

```typescript
import { PdfInspector } from './components/character/PdfInspector';

<PdfInspector />
```

**Features:**

- Upload PDF → See all field names
- View mapped vs unmapped fields
- Get mapping coverage percentage
- Console logs all unmapped fields for easy copying

## Example Workflow

1. **User creates character** in the app
2. **User clicks "Export PDF"** on character sheet
3. **User uploads** official D&D 5E PDF template
4. **System scans** template fields (70+ auto-detected)
5. **System fills** PDF with character's data
6. **User downloads** or previews filled sheet
7. **User prints** or saves for game session

## Technical Details

### Libraries

- **pdf-lib**: PDF manipulation (loading, filling, saving)
- TypeScript: Full type safety for character data

### Performance

- Client-side processing (no server needed)
- Typical fill time: < 500ms for standard character sheet
- Template caching: Store uploaded template in component state for repeated exports

### Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile browsers (may have download limitations)

## Limitations

1. **PDF must have form fields** - Scanned/flattened PDFs won't work
2. **Field names must match** - Different PDF creators use different field names
3. **Manual mapping required** - Non-standard sheets need custom mappings
4. **No reverse import** - Can't import character data FROM filled PDFs (yet)

## Future Enhancements

- [ ] Multi-page character sheet support
- [ ] Spell list integration
- [ ] Inventory/equipment auto-fill
- [ ] Template library (pre-configured popular sheets)
- [ ] Cloud storage for templates
- [ ] Batch export (multiple characters)

## Troubleshooting

**Q: "No fields detected"**  
A: PDF might not have fillable form fields. Try a different template.

**Q: "Some fields are empty in exported PDF"**  
A: Check console for unmapped fields. Add mappings in `pdfService.ts`.

**Q: "Field values are wrong"**  
A: Verify the mapper function returns the correct data type (string).

**Q: "Can't download on mobile"**  
A: Use "Preview" instead, then use browser's built-in PDF save feature.
