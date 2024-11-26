import DatasheetProviders from "@/providers/datasheet";

const DatasheetLayout = ({ children }) => {
  return (
    <DatasheetProviders>
      {children}
    </DatasheetProviders>
  )
}

export default DatasheetLayout;