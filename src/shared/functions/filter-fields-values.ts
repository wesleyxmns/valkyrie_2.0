export function filterFieldsValues(data: Record<string, any>) {
  const _data = Object.fromEntries(
    Object.entries(data).filter(
      ([key, value]) => value !== undefined && value !== ""
    )
  )
  return _data;
}