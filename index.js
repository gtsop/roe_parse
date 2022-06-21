import { parse } from 'node-html-parser';

const stdin = process.stdin;
let data = '';

stdin.setEncoding('utf8');

stdin.on('data', function (chunk) {
  data += chunk;
});

stdin.on('end', function () {
	const root = parse(data);
	const inScopeTables = findInScopeTables(root);
	if (inScopeTables.length) {
		inScopeTables.forEach(parseInScopeTable);
	}

	const outOfScopeTables = findOutOfScopeTables(root);
	if (outOfScopeTables.length) {
		outOfScopeTables.forEach(parseOutOfScopeTable);
	}
});

function findInScopeTables(root) {
	const inScopeWrappers = root.querySelectorAll('#user-guides__bounty-brief__in-scope');
	
	return inScopeWrappers.map((wrapper) => {
		return wrapper.parentNode.querySelector('table');
	})
}

function findOutOfScopeTables(root) {
	const inScopeWrappers = root.querySelectorAll('#user-guides__bounty-brief__out-of-scope');
	
	return inScopeWrappers.map((wrapper) => {
		return wrapper.parentNode.querySelector('table');
	})
}

function parseInScopeTable(table) {
	const inScopeRows = table.querySelectorAll('tr');
	inScopeRows.forEach((row) => {
		const columns = row.querySelectorAll('td');
		columns.forEach((column) => {
			const label = column.getAttribute('data-label')
			if (label === 'Target') {
				console.log('scope:include:' + column.getAttribute('aria-label'))
			}
		});
	})
}

function parseOutOfScopeTable(table) {
	const outOfScopeRows = table.querySelectorAll('tr');
	outOfScopeRows.forEach((row) => {
		const columns = row.querySelectorAll('td');
		columns.forEach((column) => {
			const label = column.getAttribute('data-label')
			if (label === 'Target') {
				console.log('scope:exclude:' + column.getAttribute('aria-label'))
			}
		});
	});
}

