function DataTable({ columns, data, onDelete }) {

  return (

    <table className="table">

      <thead>
        <tr>

          <th>ID</th>

          {columns.map((col, index) => (
            <th key={index}>{col}</th>
          ))}

          <th>حذف</th>

        </tr>
      </thead>

      <tbody>

        {data && data.length > 0 ? (

          data.map((row) => (

            <tr key={row.id}>

              <td>{row.id}</td>

              <td>{row.nom}</td>

              <td>{row.prenom}</td>

              <td>{row.email}</td>

              <td>
                <button
                  className="btn btn-delete"
                  onClick={() => onDelete(row.id)}
                >
                  حذف
                </button>
              </td>

            </tr>

          ))

        ) : (

          <tr>
            <td colSpan="5">لا توجد بيانات</td>
          </tr>

        )}

      </tbody>

    </table>

  );

}

export default DataTable;