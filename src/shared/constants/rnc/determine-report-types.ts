export const determineReportTypes = (key: string) => {
  switch (key) {
    case 'WFTQ':
      return [
        { label: "Não conformidade", value: "10500" },
        { label: "Melhorias", value: "10501" },
      ];
    default:
      return [];
  }
}