export default function MaterialModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Material</h3>

        <input placeholder="Name" />
        <input placeholder="Category" />
        <input placeholder="Stock" type="number" />
        <input placeholder="Unit" />
        <input placeholder="Min Stock" type="number" />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button>Save</button>
        </div>
      </div>
    </div>
  );
}
