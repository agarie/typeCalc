/*
typeCalc: An app for analysing a pokémon team's type-based weaknesses.
@author Carlos "Onox" Agarie
@version 0.1
*/

"use strict";

var	TYPECALC = {
	io: {},
	calc: {},
	engine: {},
	calculate: function () {
		var team = [], weaks = [], count = {};
		
		// Implementation of the calc steps
		$("#calculate").click(function () {
			
			team = TYPECALC.io.walkTheTeam();
			weaks = TYPECALC.calc.weaknesses(team);
			count = TYPECALC.calc.reduceWeaknesses(weaks);
			
			TYPECALC.io.showResultsOnUi(TYPECALC.calc.print_table(count), true);
		});						
	},
	debug: function () {
		var results = [];
		var team = [], weaks = [], count = {};
		
		team = TYPECALC.io.walkTheTeam();
		weaks = TYPECALC.calc.weaknesses(team);
		count = TYPECALC.calc.reduceWeaknesses(weaks);
		
		console.log(team);
		console.log(weaks);
		console.log(count);		
	}
};

TYPECALC.io = (function () {
	var	showResultsOnUi = function (damageTable, overwrite) {
		var base = '#typecalc ';
		var output = '#output'; // Where the results are appended
		var div = '<div id="output"></div>';
				
		// Zeroes the padding-bottom of #damagecalc to agree with div#output's
		// CSS.
		if (!$(base + output).length) {
			$(base).css({
				'padding-bottom': '0'
			})
			$(base).append(div);
		}

		// Do nothing if damageTable isn't a string.
		if (typeof damageTable === 'string') {
			if (overwrite) {
				$(base + output).html(damageTable);								
			}
			else {
				$(base + output).html(function(index, oldHTML) {
					return oldHTML + damageTable;
				});
			}
		}
	};
	
	var	walkTheTeam = function () {
		var pkmn = $("#typecalc .pokemon");
		var	type_1 = '', type_2 = '';
		var team = [];
		
		$.each(pkmn, function(index, value) {
			type_1 = value.querySelector("input[name='type-1']").value;
			type_2 = value.querySelector("input[name='type-2']").value;
			
			team.push([type_1, type_2]);
		});
		
		return team;
	};
		
	return {
		showResultsOnUi: showResultsOnUi,
		walkTheTeam: walkTheTeam
	}
}());

TYPECALC.calc = (function () {
	// TYPE_CHART: Constant object which stores the type-chart
	// Organization: rows = attack, colums = defense
	// Type order: normal, fire, water, electric, grass, ice, fighting, poison, ground, flying,
	// psychic, bug, rock, ghost, dragon, dark, steel
	var TYPES = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel"];
	var	TYPE_ORDER = {
			normal: 0,
			fire: 1,
			water: 2,
			electric: 3,
			grass: 4,
			ice: 5,
			fighting: 6,
			poison: 7,
			ground: 8,
			flying: 9,
			psychic: 10,
			bug: 11,
			rock: 12,
			ghost: 13,
			dragon: 14,
			dark: 15,
			steel: 16
	};
	var	TYPE_CHART = {
			normal: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 1, 1, 0.5],
		  fire: [1, 0.5, 0.5, 1, 2, 2, 1, 1, 1, 1, 1, 2, 0.5, 1, 0.5, 1, 2],
		  water: [1, 2, 0.5, 1, 0.5, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0.5, 1, 1],
		  electric: [1, 1, 2, 0.5, 0.5, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0.5, 1, 1],
		  grass: [1, 0.5, 2, 1, 0.5, 1, 1, 0.5, 2, 0.5, 1, 0.5, 2, 1, 0.5, 1, 0.5],
		  ice: [1, 0.5, 0.5, 1, 2, 0.5, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 0.5],
		  fighting: [2, 1, 1, 1, 1, 2, 1, 0.5, 1, 0.5, 0.5, 0.5, 2, 0, 1, 2, 2],
		  poison: [1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 0],
		  ground: [1, 2, 1, 2, 0.5, 1, 1, 2, 1, 0, 1, 0.5, 2, 1, 1, 1, 2],
		  flying: [1, 1, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 0.5],
		  psychic: [1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0.5, 1, 1, 1, 1, 0, 0.5],
		  bug: [1, 0.5, 1, 1, 2, 1, 0.5, 0.5, 1, 0.5, 2, 1, 1, 0.5, 1, 2, 0.5],
		  rock: [1, 2, 1, 1, 1, 2, 0.5, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 0.5],
		  ghost: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 0.5],
		  dragon: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0.5],
		  dark: [1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 0.5],
		  steel: [1, 0.5, 0.5, 0.5, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0.5]
	};
		
	// Returns the effectiveness of all types attacking a type1/type2 pokemon
	var matchup = function (type1, type2) {
		if (typeof type1 !== "string" || TYPE_CHART[type1] === undefined) {
			return false;
		}
		
		var TRANSPOSED_TYPE_CHART = transpose(TYPE_CHART),
		    result = [],
		    ary1 = TRANSPOSED_TYPE_CHART[type1.toLowerCase()],
		    ary2 = (typeof type2 === "string" && type2.length > 0) ? TRANSPOSED_TYPE_CHART[type2.toLowerCase()] : [];
		
		result = dotProduct(ary1, ary2) || ary1;
		
		return result;
	};
	
	// Maps a team array, composed of arrays with 2 elements (strings defining
	// types), into a weaknesses array, where each entry is returned from
	// matchup(entry[0], entry[1]).
	var	weaknesses = function (team) {
		var ary = [];
				
		team.forEach(function (entry) {
			ary.push(matchup(entry[0], entry[1]));
		});
		
		return ary;
	};
	
	// Maps an effectivity value (0, 0.25, 0.50, 1, 2, 4) to weaknessCount
	// or resistCount.
	var mapEffectivity = function (effectivity) {
		switch (effectivity) {
			case 0:
			case 0.25:
			case 0.50:
				return "resistCount";
			
			case 1:
				return undefined;
			
			case 2:
			case 4:
				return "weaknessCount"

			default:
				return undefined;
		}
	};
	
	// Reduces a weaknesses array into an array where each entry is an object
	// with .weaknessCount and .resistCount properties.
	var reduceWeaknesses = function (weaknesses) {
		var count = {}; 
		var typeOfCount = "";
		
		count.weaknessCount = []; 
		count.resistCount = [];
		
		weaknesses.forEach(function(entry) {
			entry.forEach(function(effect, index) {
				typeOfCount = mapEffectivity(effect);
				
				if (typeOfCount) {
					if (!count[typeOfCount][index]) { count[typeOfCount][index] = 0; }
					count[typeOfCount][index] += 1;
				}				
			});
		});
		
		return count;
	};
	
	// Methods to count how many weaknesses/resists you have for each type
	var print_table = function (count) {
		var output = "";
		
		// Weaknesses list
		output += "<ul><h2>Your team has some weaknesses...</h2>";
		count.weaknessCount.forEach(function(entry, index) {
			output += "<li>" + TYPES[index] + ": " + entry + "</li>";
		});
		output += "</ul>";
		
		// Resists list
		output += "<ul><h2>And some resists...</h2>";
		count.resistCount.forEach(function(entry, index) {
			output += "<li>" + TYPES[index] + ": " + entry + "</li>";
		});
		output += "</ul>";
		
		return output;
	};
	
	// Assumes that the input is an object of arrays
	var	transpose = function (matrix) {
		if (typeof matrix !== "object") {
			return false;
		}
		
		var m = 0,
		    col = [],
		    colName = [],
		    transposed = {},
		    i = 0;
		
		for (var key in matrix) {
			if (matrix.hasOwnProperty(key)) {
				colName.push(key);
			}
		}
					
		if (colName.length === 0) {
			return false;
		} 
		else {
			m = matrix[colName[0]].length;
		}
		
		if (!m || m === undefined) {
			return false;
		}
		
		for (i = 0; i < m; i = i + 1) {
			for (var key in matrix) {
				if (matrix.hasOwnProperty(key)) {
					col.push(matrix[key][i]);
				}
			}
			
			transposed[colName[i]] = col;
			col = [];
		}
		
		return transposed;
	};
		
	// Element-wise multiplication of two arrays
	var	dotProduct = function (u, v) {
		if (u.length !== v.length) {
			return undefined;
		}
		
		var n = u.length,
		    result = [],
		    i;
		
		for (i = n; i > 0; i = i - 1) {
			result[i-1] = u[i-1] * v[i-1];
		}
		
		return result;
	};
	
	return {
		matchup: matchup,
		weaknesses: weaknesses,
		mapEffectivity: mapEffectivity,
		reduceWeaknesses: reduceWeaknesses,
		print_table: print_table,
		transpose: transpose,
		dotProduct: dotProduct
	};
}());