import { MultiSelectProvider } from "./providers/multi-select/multi-select-provider";

export default function DatasheetProviders({ children }) {
  return (
    <MultiSelectProvider>
      {children}
    </MultiSelectProvider>
  );
}