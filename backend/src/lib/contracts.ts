// Loads the ICM stage contracts (system instructions) + family-profile reference.
// These are the same contracts the original icm_watcher.py read from CONTEXT.md files;
// here they ship in the image under backend/contracts/ (override dir via CONTRACTS_DIR).
import fs from 'fs';
import path from 'path';

const DIR = process.env.CONTRACTS_DIR || path.resolve(__dirname, '../../contracts');

function load(file: string): string {
  return fs.readFileSync(path.join(DIR, file), 'utf8');
}

// Cached at first use (contracts are static within a deploy).
let cache: { extraction: string; synthesis: string; familyProfiles: string } | null = null;

export function contracts() {
  if (!cache) {
    cache = {
      extraction: load('extraction_contract.md'),
      synthesis: load('synthesis_contract.md'),
      familyProfiles: load('family_profiles.md'),
    };
  }
  return cache;
}
