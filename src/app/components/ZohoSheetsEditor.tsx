import React, { useState, useRef, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  Share2,
  Check,
  X,
  Lock,
  Unlock,
  Plus,
  Trash2,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export interface SheetCell {
  value: string;
  editable: boolean;
  style?: {
    bold?: boolean;
    backgroundColor?: string;
    color?: string;
  };
}

export interface SheetRow {
  cells: SheetCell[];
}

export interface SheetData {
  name: string;
  rows: SheetRow[];
  status: 'draft' | 'pending' | 'approved' | 'locked';
  version: number;
}

interface ZohoSheetsEditorProps {
  data: SheetData;
  onUpdate: (data: SheetData) => void;
  onApprove: () => void;
  onRequestChanges: () => void;
}

export function ZohoSheetsEditor({
  data,
  onUpdate,
  onApprove,
  onRequestChanges,
}: ZohoSheetsEditorProps) {
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isLocked = data.status === 'approved' || data.status === 'locked';

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  const handleCellClick = (rowIdx: number, colIdx: number) => {
    if (isLocked) return;
    setSelectedCell({ row: rowIdx, col: colIdx });
  };

  const handleCellDoubleClick = (rowIdx: number, colIdx: number) => {
    if (isLocked) return;
    const cell = data.rows[rowIdx]?.cells[colIdx];
    if (cell && cell.editable) {
      setEditingCell({ row: rowIdx, col: colIdx });
      setEditValue(cell.value);
    }
  };

  const handleCellUpdate = () => {
    if (!editingCell) return;

    const newRows = [...data.rows];
    if (newRows[editingCell.row]?.cells[editingCell.col]) {
      newRows[editingCell.row].cells[editingCell.col].value = editValue;
      onUpdate({ ...data, rows: newRows });
    }

    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellUpdate();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  };

  const addRow = () => {
    if (isLocked) return;
    const colCount = data.rows[0]?.cells.length || 2;
    const newRow: SheetRow = {
      cells: Array(colCount)
        .fill(null)
        .map(() => ({ value: '', editable: true })),
    };
    onUpdate({ ...data, rows: [...data.rows, newRow] });
  };

  const deleteRow = (rowIdx: number) => {
    if (isLocked) return;
    const newRows = data.rows.filter((_, idx) => idx !== rowIdx);
    onUpdate({ ...data, rows: newRows });
  };

  // Calculate column widths
  const columnCount = data.rows[0]?.cells.length || 0;
  const columnLetters = Array.from({ length: columnCount }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            <h3 className="text-gray-900">{data.name}</h3>
            <StatusBadge status={data.status} />
            {isLocked ? (
              <Lock className="w-4 h-4 text-blue-600" />
            ) : (
              <Unlock className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-xs text-gray-500">v{data.version}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Import"
            >
              <Upload className="w-4 h-4 text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {!isLocked && (
          <div className="flex items-center gap-2">
            <button
              onClick={addRow}
              className="px-3 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Row
            </button>
            <span className="text-xs text-gray-500">
              💡 Double-click cells to edit, or use chat to modify content
            </span>
          </div>
        )}
      </div>

      {/* Spreadsheet */}
      <div className="overflow-auto" style={{ maxHeight: '600px' }}>
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-300 bg-gray-100 w-12 text-center text-xs text-gray-600 py-2">
                #
              </th>
              {columnLetters.map((letter) => (
                <th
                  key={letter}
                  className="border border-gray-300 bg-gray-100 min-w-[150px] text-center text-xs text-gray-600 py-2"
                >
                  {letter}
                </th>
              ))}
              {!isLocked && (
                <th className="border border-gray-300 bg-gray-100 w-12"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td className="border border-gray-300 bg-gray-50 text-center text-xs text-gray-600 py-2">
                  {rowIdx + 1}
                </td>
                {row.cells.map((cell, colIdx) => {
                  const isSelected =
                    selectedCell?.row === rowIdx &&
                    selectedCell?.col === colIdx;
                  const isEditing =
                    editingCell?.row === rowIdx && editingCell?.col === colIdx;

                  return (
                    <td
                      key={colIdx}
                      className={`border border-gray-300 p-0 relative ${
                        isSelected ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => handleCellClick(rowIdx, colIdx)}
                      onDoubleClick={() =>
                        handleCellDoubleClick(rowIdx, colIdx)
                      }
                      style={{
                        backgroundColor:
                          cell.style?.backgroundColor || 'white',
                        color: cell.style?.color || '#374151',
                      }}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellUpdate}
                          onKeyDown={handleKeyDown}
                          className="w-full px-2 py-1 text-sm outline-none border-2 border-blue-500"
                        />
                      ) : (
                        <div
                          className={`px-2 py-1 text-sm min-h-[32px] ${
                            cell.style?.bold ? 'font-bold' : ''
                          } ${cell.editable ? 'cursor-text' : 'cursor-default'}`}
                        >
                          {cell.value}
                        </div>
                      )}
                    </td>
                  );
                })}
                {!isLocked && (
                  <td className="border border-gray-300 text-center">
                    <button
                      onClick={() => deleteRow(rowIdx)}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                      title="Delete row"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      {!isLocked && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 flex gap-3">
          <button
            onClick={onApprove}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Approve MRD
          </button>
          <button
            onClick={onRequestChanges}
            className="px-4 py-2 border border-orange-300 bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Request Changes
          </button>
        </div>
      )}

      {isLocked && (
        <div className="border-t border-gray-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Lock className="w-4 h-4" />
            <span>
              This document has been approved and locked at version {data.version}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
