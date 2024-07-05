import { ColumnProps } from "primereact/column";

import * as XLSX from 'xlsx';
export function convertArrayOfObjectsToExcel<T>(columns: ColumnProps[], array: T[]): Blob {
	const worksheetData: any[][] = [];

	// Add column headers
	const headerRow = columns.map(x => x.header);
	worksheetData.push(headerRow);

	// Add rows
	array.forEach(() => {
		const row = columns.map(column => {
			let value = '';
			if (column.field) {
				value = column.field;
			}
			return value;
		});
		worksheetData.push(row);
	});

	// Create worksheet and workbook
	const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

	// Generate Excel file and return as Blob
	const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
	return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}