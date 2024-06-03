import { TableColumn } from "react-data-table-component";

import * as XLSX from 'xlsx';
export function convertArrayOfObjectsToExcel<T>(columns: TableColumn<T>[], array: T[]): Blob {
	const worksheetData: any[][] = [];

	// Add column headers
	const headerRow = columns.map(x => x.name);
	worksheetData.push(headerRow);

	// Add rows
	array.forEach(item => {
		const row = columns.map(column => {
			let value = '';
			if (column.selector) {
				value = column.selector(item).toString();
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