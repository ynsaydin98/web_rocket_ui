import { JsonViewer } from "../../../shared/components/JsonViewer";
import { Panel } from "../../../shared/components/Panel";
import { useDebugStore } from "../store/debugStore";
export function RawMessageViewer() {
  const rawMessages = useDebugStore((state) => state.rawMessages);
  const clearRawMessages = useDebugStore((state) => state.clearRawMessages);
  return (
    <Panel
      title="Ham Mesajlar"
      eyebrow={`${rawMessages.length} KAYIT`}
      action={
        <button
          type="button"
          className="button button--quiet"
          onClick={clearRawMessages}
        >
          Temizle
        </button>
      }
    >
      <div className="message-list">
        {rawMessages.length === 0 ? (
          <p className="empty-state">Henüz mesaj yok.</p>
        ) : (
          rawMessages.map((message, index) => (
            <article
              className="message-entry"
              key={`${index}-${message.slice(0, 20)}`}
            >
              <span className="message-entry__index">
                #{String(index + 1).padStart(3, "0")}
              </span>
              <JsonViewer value={message} />
            </article>
          ))
        )}
      </div>
    </Panel>
  );
}
