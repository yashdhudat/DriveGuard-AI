export default function FleetSelector({ vehicles, onSelect }) {
  return (
    <div>
      <label>Vehicle</label>
      <select onChange={(e)=> onSelect(e.target.value)}>
        {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
      </select>
    </div>
  );
}
