type Props = { value: unknown; emptyText?: string };
export function JsonViewer({ value, emptyText = "Veri yok." }: Props) {
  if (value === undefined || value === null || value === "")
    return <p className="empty-state">{emptyText}</p>;
  return (
    <pre className="json-viewer">
      {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
    </pre>
  );
}
