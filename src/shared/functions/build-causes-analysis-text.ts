import { Whys } from "../interfaces/cause-analysis";

export function buildCauseAnalysisText(whysArray: Whys[]): string {
  const preventDeletionRegex = /\b(Causa Raíz|Porque)\b/g;

  return whysArray.map((whys) => {
    const rootCause = whys.rootCause;

    return `
      ${whysArray.indexOf(whys) + 1}° Causa: 
      1° Porque: ${whys.firstBecause.replace(preventDeletionRegex, match => match)}
      2° Porque: ${whys.secondBecause.replace(preventDeletionRegex, match => match)}
      3° Porque: ${whys.thirdBecause.replace(preventDeletionRegex, match => match)}
      4° Porque: ${whys.fourthBecause.replace(preventDeletionRegex, match => match)}
      5° Porque: ${whys.fifthBecause.replace(preventDeletionRegex, match => match)}
      Causa Raíz: ${rootCause.replace(preventDeletionRegex, match => match)}
    `;
  }).join(' | ');
}