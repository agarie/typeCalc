/*
typeCalc: An app for analysing a pokémon team's type-based weaknesses.
@author Carlos "Onox" Agarie
@version 0.2
*/

"use strict";

var	TYPECALC = {
	io: {},
	calc: {},
	engine: {},
	calculate: function () {
		var team = [], totalResistsAndWeaks = {};
		var report = '';
		
		// Implementation of the calc steps
		team = TYPECALC.io.walkTheTeam();
		
		totalResistsAndWeaks = TYPECALC.calc.typeCalc(team);
		console.log(totalResistsAndWeaks);
		//report = TYPECALC.io.createReport(totalResistsAndWeaks);
		
		//TYPECALC.io.showResultsOnUi(report);
	},
	debug: function () {
		var team = [], matchup = [], effectCount = [], count = {};
		
		team = TYPECALC.io.walkTheTeam();
		
		// These are the steps which calc.typeCalc() do.
		matchup = team.map(TYPECALC.calc.matchup);
		effectCount = matchup.map(TYPECALC.calc.effectCount);
		count = effectCount.reduce(TYPECALC.calc.sumEffectiveness, {});
		
		console.log("Team");
		console.log(team);
		console.log("Arrays of matchups");
		console.log(matchup);
		console.log("Each pokémon's effects count");
		console.log(effectCount);
		console.log("Final result (total effects count)");
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
	
	var createReport = function (totalResistsAndWeaks) {
		
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
		
	// Returns the effectiveness array of the type1/type2 pokemon.
	//
	var matchup = function (types) {
		var type1 = types[0];
		var type2 = types[1];
		
		if (typeof type1 !== "string" || TYPE_CHART[type1] === undefined) {
			return false;
		}
		
		var TRANSPOSED_TYPE_CHART = transpose(TYPE_CHART);
		var result = [];
		var ary1 = TRANSPOSED_TYPE_CHART[type1.toLowerCase()];
		var ary2 = (typeof type2 === "string" && type2.length > 0) ? TRANSPOSED_TYPE_CHART[type2.toLowerCase()] : [];
		
		result = dotProduct(ary1, ary2) || ary1;
		
		return result;
	};
	
	// Converts an effectivity value to its corresponding string.
	//
	var effectivityTable = function (effectivity) {
		switch (effectivity) {
			case 0: return "noEffect";
			
			case 0.25: return "quarterEffect";
			case 0.50: return "halfEffect";

			case 1: return "normalEffect";

			case 2: return "doubleEffect";
			case 4: return "quadEffect";

			default: return undefined;
		}
	};
	
	// Converts a weakness array into an object made with the number of
	// weaks/resists. For example:
	//
	// [2, 0.5, 4, ...] => {"normalEffect": 3, "quadEffect": 2, ...}
	//
	var effectCount = function (effectivenessArray) {
		var count = {};
		
		// An example of weakness is [1, 0.25, 0.5, 4, 2, 4, ...].
		effectivenessArray.forEach(function (current) {
			var eff = effectivityTable(current);
			
			count[eff] = count[eff] + 1 || 1;
		});
		
		return count;
	};

	// Used to simplify typeCalc's code. Accumulates the properties of el into
	// acc, setting their initial value to el's if they're undefined.
	//
	var sumEffectiveness = function (acc, el) {
		for (var prop in el) {
			if (el.hasOwnProperty(prop)) {
				acc[prop] = acc[prop] + el[prop] || el[prop];
			}
		}
	
		return acc;
	};

	// Implements the functions for getting the weaks/resists count through a
	// MapReduce fashion.
	//
	var	typeCalc = function (team, options) {
		var count;
		options = options || {};

		// Count is the number of weaks/resists of each pokémon.
		count = team.map(matchup).filter(function (el) {
			return el;
		}).map(effectCount);

		// Stop here if the total weaks/resists of the team aren't needed.
		if (options.partialCount) return count;
		
		// Else, sum all of them.
		return count.reduce(sumEffectiveness, {});
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
		effectCount: effectCount,
		sumEffectiveness: sumEffectiveness,
		typeCalc: typeCalc,
		transpose: transpose,
		dotProduct: dotProduct
	};
}());

$(document).ready(function () {
	$("#typecalc button#calculate").click(function () {
		TYPECALC.calculate();
	});
});