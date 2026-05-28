import { ParseError, type ParseResult } from "./types";
import { parseFit } from "./fit";
import { parseGpx } from "./gpx";
import { parseTcx } from "./tcx";
import { parseZwo } from "./zwo";
import { parseErg, parseMrc } from "./erg";
import { parseCsv } from "./csv";

export type { ParseResult, ParsedActivity, ParsedWorkout } from "./types";
export { ParseError };

export async function parseWorkoutFile(file: File): Promise<ParseResult> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "fit":
      return parseFit(await file.arrayBuffer());
    case "gpx":
      return parseGpx(await file.text());
    case "tcx":
      return parseTcx(await file.text());
    case "zwo":
      return parseZwo(await file.text());
    case "erg":
      return parseErg(await file.text());
    case "mrc":
      return parseMrc(await file.text());
    case "csv":
      return parseCsv(await file.text());
    default:
      throw new ParseError(`Tipo de archivo no soportado: .${ext ?? "?"}`);
  }
}

export const SUPPORTED_EXTENSIONS = ["fit", "gpx", "tcx", "zwo", "erg", "mrc", "csv"] as const;
