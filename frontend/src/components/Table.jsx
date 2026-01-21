export default function Table({ columns, rows, rowKey }) {
  return (
    <div className="overflow-auto border rounded">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left p-2 border-b">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="p-3 text-gray-600" colSpan={columns.length}>
                No data
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={rowKey(r)} className="hover:bg-gray-50">
                {columns.map((c) => (
                  <td key={c.key} className="p-2 border-b align-top">
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
