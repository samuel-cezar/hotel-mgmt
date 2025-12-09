import React from 'react';
import Button from './Button';

/**
 * DataTable Component
 * Responsive table that switches to card layout on mobile
 * Automatically applies data-label attributes for mobile display
 */
const DataTable = ({
  columns = [], // Array of { key, label }
  data = [],
  loading = false,
  onEdit = null,
  onDelete = null,
  onView = null,
  actions = null, // Custom render function for actions
  emptyMessage = 'No data available',
  className = '',
}) => {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner-border" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`.trim()}>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {(onEdit || onDelete || onView || actions) && <th></th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column.key}`}
                  data-label={column.label}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
              {(onEdit || onDelete || onView || actions) && (
                <td data-label="Actions" className="table-actions">
                  {actions ? (
                    actions(row)
                  ) : (
                    <>
                      {onView && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onView(row)}
                        >
                          View
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onEdit(row)}
                        >
                          Editar
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            if (
                              window.confirm(
                                'Are you sure you want to delete this item?'
                              )
                            ) {
                              onDelete(row);
                            }
                          }}
                        >
                          Deletar
                        </Button>
                      )}
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
