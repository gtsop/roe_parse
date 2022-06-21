import { parse } from 'node-html-parser';

const stdin = process.stdin;
let data = '';

stdin.setEncoding('utf8');

stdin.on('data', function (chunk) {
	data += chunk;
});

stdin.on('end', function () {
	const root = parse(data);

	findInScopeTables(root).forEach(parseInScopeTable);

	findOutOfScopeTables(root).forEach(parseOutOfScopeTable);
});


function findInScopeTables(root) {
	return findTables(root, '#user-guides__bounty-brief__in-scope');
}

function findOutOfScopeTables(root) {
	return findTables(root, '#user-guides__bounty-brief__out-of-scope');
}

function findTables(root, selector) {
	return root.querySelectorAll(selector).map((wrapper) => {
		return wrapper.parentNode.querySelector('table');
	})
}

function parseInScopeTable(table) {
	return parseTableCells(table, function ({ key, value }) {
		if (key === 'Target') {
			console.log('scope:include:' + value)
		}
	})
}

function parseOutOfScopeTable(table) {
	return parseTableCells(table, function ({ key, value }) {
		if (key === 'Target') {
			console.log('scope:exclude:' + value)
		}
	})
}

function parseTableCells(table, callback) {
	table.querySelectorAll('tr').forEach((row) => {
		const columns = row.querySelectorAll('td');
		columns.forEach((column) => {
			const key = column.getAttribute('data-label')
			const value = column.getAttribute('aria-label')
			callback({ key, value });
		});
	})
}
