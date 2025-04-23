// lib/loadCsvDeck.ts
import fs from "fs";
import { parse } from "csv-parse/sync";

export function loadCsvDeck(filePath: string) {
  const fileContent = fs.readFileSync(filePath);
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
  return records;
}
