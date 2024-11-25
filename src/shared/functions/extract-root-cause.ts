export const extractEnumeratedRootCauses = (description: string): string[] => {
  // Divide o texto em linhas
  const lines = description.split('\n');
  
  // Array para armazenar todas as causas raiz encontradas
  const rootCauses: string[] = [];
  
  // Procura por todas as linhas que começam com "Causa Raíz:"
  lines.forEach(line => {
    if (line.trim().startsWith('Causa Raíz:')) {
      // Remove o prefixo "Causa Raíz:" e espaços extras
      let rootCause = line.split('Causa Raíz:')[1].trim();
      
      // Remove códigos ANSI de cor
      rootCause = rootCause.replace(/\u001b\[\d+m/g, '');
      
      // Adiciona a causa raiz ao array
      rootCauses.push(rootCause);
    }
  });
  
  // Limita a 5 causas e enumera cada uma
  return rootCauses
    .slice(0, 5)
    .map((cause, index) => `${index + 1}ª Causa Raíz: ${cause}`);
};