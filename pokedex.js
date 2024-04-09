/*
 * pokedex.js
 * Prompts the user for a Pokemon, move, or item search
 * term and calls the PokeAPI to retrieve the results.
 *
 * Luke Dykstra
 * CIS343-01
 * 04/07/2024
 */

const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

// Prompt the user for a search term and call the callback function
function prompt(cb) {
	rl.question('Enter search term: ', response => { cb(response) });
}

// Print the menu options
function showMenu() {
	console.log('================================');
	console.log('1: Search Pokemon');
	console.log('2: Search Move');
	console.log('3: Search Item');
}

// Start the program loop
function run() {
	showMenu();
	rl.question('Enter a choice to run: ', response => {
		switch(response) {
			case '1':
				prompt(searchPoke);
				break;
			case '2':
				prompt(searchMove);
				break;
			case '3':
				prompt(searchItem);
				break;
			default:
				console.error('Not a valid menu option!');
				console.log('Must be a number 1-3.');
				run();
				break;
		}
	});
}

// Print Pokemon JSON data
function printPoke(poke) {
	console.log('======== ' + cap(poke.name) + ' [Pokemon]========');
	console.log('Height: ' + poke.height);
	console.log('Weight: ' + poke.weight);
	console.log('Base Exp: ' + poke.base_experience);
	console.log('Moves:');
	
	// Print each move as a list
	poke.moves.forEach(function(item) {
		console.log(' - ' + item.move.name);
	});
}

// Search the PokeAPI for a Pokemon
function searchPoke(term) {
	fetch('https://pokeapi.co/api/v2/pokemon/' + term + '/')
		.then( result => { return result.json(); })
		.then( json => {
			printPoke(json);
			run();
		})
		.catch( e => {
			console.error(`Failure retrieving pokemon data for \'${term}\'`);
			run();
		});
}

// Print move JSON data
function printMove(move) {
	// Find the official English name for the move and print it
	move.names.forEach(function(item) {
		if (item.language.name == 'en') {
			console.log('======== ' + item.name + ' [Move]========');
		}
	});

	console.log('Type: ' + move.type.name);
	console.log('Damage: ' + move.damage_class.name);
	console.log('PP: ' + move.pp);
	console.log('Power: ' + (move.power != null? move.power : '[none]'));
	console.log('Accuracy: ' + (move.accuracy != null? move.accuracy: '[none]'));
	// Print the English move description
	// There could be multiple English descriptions, so this needs
	// to be a for loop so we can break once we've found one.
	for (var i = 0; i < move.flavor_text_entries.length; i ++) {
		if (move.flavor_text_entries[i].language.name == 'en') {
			console.log(move.flavor_text_entries[i].flavor_text);
			break;
		}
	}
}

// Search the PokeAPI for a move
function searchMove(term) {
	fetch('https://pokeapi.co/api/v2/move/' + term + '/')
		.then( result => { return result.json(); })
		.then( json => {
			printMove(json);
			run();
		})
		.catch( e => {
			console.error(`Failure retrieving move data for \'${term}\'`);
			run();
		});
}

// Print item JSON data
function printItem(item) {
	// Find the official English name for the item and print it
	item.names.forEach(function(item) {
		if (item.language.name == 'en') {
			console.log('======== ' + item.name + ' [Item]========');
		}
	});

	console.log('Category: ' + item.category.name);
	console.log('Cost: ' + item.cost);
	console.log('Fling Power: ' + (item.fling_power != null? item.fling_power : '[none]'));
	// Print the English item description
	for(var i = 0; i < item.flavor_text_entries.length; i ++) {
		if (item.flavor_text_entries[i].language.name == 'en') {
			console.log(item.flavor_text_entries[i].text);
			break;
		}
	}
}

// Search the PokeAPI for an item
function searchItem(term) {
	fetch('https://pokeapi.co/api/v2/item/' + term + '/')
		.then( result => { return result.json(); })
		.then( json => {
			printItem(json);
			run();
		})
		.catch( e => {
			console.error(`Failure retrieving item data for \'${term}\'`);
			run();
		});
}

// Helper function to return text with the first letter capitalized
// Used for Pokemon names in printPoke()
function cap(text) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

run();
