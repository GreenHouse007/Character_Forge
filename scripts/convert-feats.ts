import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

// ============================================================
// Configuration
// ============================================================

const CSV_PATH = path.resolve(__dirname, '../src/data/feats/feats_with_books_and_categories.csv');
const JSON_OUTPUT = path.resolve(__dirname, '../src/data/feats/all-feats.generated.json');
const TS_OUTPUT = path.resolve(__dirname, '../src/data/feats/all-feats.generated.ts');

const DASH = '\u2014'; // em-dash used in CSV for empty values

function isEmpty(val: string | undefined): boolean {
  if (!val) return true;
  const trimmed = val.trim();
  return trimmed === '' || trimmed === DASH || trimmed === '-' || trimmed === '\u2014';
}

// ============================================================
// Main conversion
// ============================================================

interface FeatRecord {
  name: string;
  uri: string;
  prerequisitesText: string;
  shortDescription: string;
  longDescription: string;
  source: string;
  categories: string[];
}

function convertRow(row: Record<string, string>, rowIndex: number, warnings: string[]): FeatRecord | null {
  const rawName = (row['Name'] || '').trim();
  if (!rawName || isEmpty(rawName)) {
    warnings.push(`Row ${rowIndex}: Empty feat name, skipping`);
    return null;
  }

  const uri = (row['URI'] || '').trim();
  const prerequisitesText = isEmpty(row['Prerequisites']) ? 'None' : row['Prerequisites'].trim();
  const shortDescription = (row['Short Description'] || '').trim();
  const longDescription = (row['long_description'] || '').trim();
  const source = (row['Books'] || '').trim();

  // Parse categories - comma-separated in CSV
  const rawCategories = (row['Category'] || '').trim();
  const categories: string[] = [];
  if (!isEmpty(rawCategories)) {
    for (const cat of rawCategories.split(',')) {
      const trimmed = cat.trim();
      if (trimmed && trimmed !== 'Untyped') {
        categories.push(trimmed);
      }
    }
  }

  return {
    name: rawName,
    uri,
    prerequisitesText,
    shortDescription,
    longDescription,
    source,
    categories,
  };
}

function main() {
  console.log('Reading CSV file...');
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');

  console.log('Parsing CSV...');
  const records: Record<string, string>[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    relax_quotes: true,
    trim: false,
  });

  console.log(`Parsed ${records.length} rows from CSV`);

  const warnings: string[] = [];
  const feats: FeatRecord[] = [];
  const categoryCounts: Record<string, number> = {};
  const sourceCounts: Record<string, number> = {};

  for (let i = 0; i < records.length; i++) {
    const feat = convertRow(records[i], i + 2, warnings); // +2 because row 1 is header
    if (feat) {
      feats.push(feat);

      // Track stats
      if (feat.source) {
        sourceCounts[feat.source] = (sourceCounts[feat.source] || 0) + 1;
      }
      if (feat.categories.length === 0) {
        categoryCounts['(Uncategorized)'] = (categoryCounts['(Uncategorized)'] || 0) + 1;
      } else {
        for (const cat of feat.categories) {
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }
      }
    }
  }

  // Print warnings
  if (warnings.length > 0) {
    console.log(`\n=== WARNINGS (${warnings.length}) ===`);
    for (const w of warnings.slice(0, 20)) {
      console.log(`  ${w}`);
    }
    if (warnings.length > 20) {
      console.log(`  ... and ${warnings.length - 20} more`);
    }
  }

  // Print stats
  console.log(`\n=== CONVERSION STATS ===`);
  console.log(`Total feats converted: ${feats.length} / ${records.length} rows`);
  console.log(`\nFeats by category:`);
  for (const [cat, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }
  console.log(`\nUnique sources: ${Object.keys(sourceCounts).length}`);
  console.log(`Top sources:`);
  for (const [source, count] of Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).slice(0, 10)) {
    console.log(`  ${source}: ${count}`);
  }

  // Write JSON
  const jsonData = JSON.stringify(feats, null, 2);
  fs.writeFileSync(JSON_OUTPUT, jsonData, 'utf-8');
  console.log(`\nWrote ${feats.length} feats to ${JSON_OUTPUT}`);
  console.log(`JSON size: ${(Buffer.byteLength(jsonData, 'utf-8') / 1024 / 1024).toFixed(2)} MB`);

  // Write thin TypeScript wrapper
  const tsWrapper = `// AUTO-GENERATED FILE - Do not edit manually
// Generated from: feats_with_books_and_categories.csv
// Generated on: ${new Date().toISOString()}
// Total feats: ${feats.length}

import { Feat } from '@/types/feat';
import data from './all-feats.generated.json';

export const ALL_FEATS_DATA: Feat[] = data as unknown as Feat[];
`;
  fs.writeFileSync(TS_OUTPUT, tsWrapper, 'utf-8');
  console.log(`Wrote TypeScript wrapper to ${TS_OUTPUT}`);
}

main();
