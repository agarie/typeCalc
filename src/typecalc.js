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
		var team = [], resistsAndWeaks = {};
		var report = '';
		
		// Implementation of the calc steps
		team = TYPECALC.io.walkTheTeam();
				
		resistsAndWeaks = TYPECALC.calc.typeCalc(team);
				
		report = TYPECALC.io.createReport(resistsAndWeaks);
		
		TYPECALC.io.showResultsOnUi(report, true);
	},
	debug: function () {
		var team = [], matchup = [], effectCount = [], count = {};
		
		team = TYPECALC.io.walkTheTeam();
		console.log("Team");
		console.log(team);
				
		// These are the steps which calc.typeCalc() do.
		matchup = team.map(TYPECALC.calc.matchup);
		console.log("Arrays of matchups");
		console.log(matchup);

		matchup = matchup.filter(function (el) {
			return el;
		});
		console.log("Filtered Matchup");
		console.log(matchup);
		
		effectCount = matchup.map(TYPECALC.calc.countEachTypeEffect);
		console.log("Each pokémon's effects count");
		console.log(effectCount);

		count = effectCount.reduce(TYPECALC.calc.mergeEffects, []);
		console.log("Merged Effects");
		console.log(count);
		
		count = count.map(TYPECALC.calc.createEffectsObject);
		console.log("Final results");
		console.log(count);
	}
};

// Constants used throughout the program.
// TYPE_CHART: Constant object which stores the type-chart
// Organization: rows = attack, colums = defense
// Type order: normal, fire, water, electric, grass, ice, fighting, poison, ground, flying,
// psychic, bug, rock, ghost, dragon, dark, steel
TYPECALC.TYPES = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel"];
TYPECALC.TYPE_ORDER = {
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
TYPECALC.TYPE_CHART = {
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

TYPECALC.io = (function () {
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

	var	showResultsOnUi = function (output, overwrite) {
		var base = '#typecalc ';
		var outputClass = '.output'; // Where the results are appended
				
		// Zeroes the padding-bottom of base to agree with .output
		if (!$(base + outputClass).length) {
			$(base).css({
				'padding-bottom': '0'
			})
		}

		if (overwrite) {
			// Remove old output and append new one.
			$(base + outputClass).remove();
			$(base).append(output);
		}
		else {
			// Do not remove old output.
			$(base + outputClass).append(output);
		}
	};
	
	var createReportHeader = function () {
		var tmp = $("<tr>");

		tmp.append("<th>Tipo</th>");
		tmp.append("<th>Resistências 4x</th>");
		tmp.append("<th>Resistências 2x</th>");
		tmp.append("<th>Imunidades</th>");
		tmp.append("<th>Fraquezas 2x</th>");
		tmp.append("<th>Fraquezas 4x</th>");
		
		return tmp;
	};
	
	var createReport = function (resistsAndWeaks) {
		// Initialize the report parts as jQuery objects.
		var report = $("<table>");
		var reportHead = $("<thead></thead>");
		var reportBody = $("<tbody>");
		
		var tmp = $("<tr>");
		
		var TYPES = TYPECALC.TYPES;
		var rw = resistsAndWeaks || {};

		// Add classes.
		report.addClass("output center table");
		
		// Create the report headers.		
		tmp = createReportHeader();

		reportHead.append(tmp[0]);

		// Clean your garbage!
		tmp = $("");

		report.append(reportHead[0]);

		// Create the report body.
		//
		// Iterate through all elements. Each one is a type. Construct their rows
		// accordingly. The keys for noEffect, quarterEffect, halfEffect,
		// normalEffect, doubleEffect and quadEffect. If it's undefined, put the
		// value 0.
		rw.forEach(function (el, index) {
			var obj, key;

			obj = {
				quarterEffect: 0,
				halfEffect: 0,
				noEffect: 0,
				doubleEffect: 0,
				quadEffect: 0
			};

			for (key in el) {
				if (el.hasOwnProperty(key)) {
					obj[key] = el[key];
				}
			}

			// A new row appears!
			tmp = $("<tr>");

			tmp.append("<td>" + TYPES[index] + "</td>");
			tmp.append("<td>" + obj.quarterEffect + "</td>");
			tmp.append("<td>" + obj.halfEffect + "</td>");
			tmp.append("<td>" + obj.noEffect + "</td>");
			tmp.append("<td>" + obj.doubleEffect + "</td>");
			tmp.append("<td>" + obj.quadEffect + "</td>");

			reportBody.append(tmp);

			tmp = $(""); // Clean your garbage!
		});

		report.append(reportBody);

		return report;
	};
	
	return {
		showResultsOnUi: showResultsOnUi,
		walkTheTeam: walkTheTeam,
		createReport: createReport
	}
}());

TYPECALC.calc = (function () {
	var TYPES = TYPECALC.TYPES;
	var TYPE_ORDER = TYPECALC.TYPE_ORDER;
	var TYPE_CHART = TYPECALC.TYPE_CHART;
		
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
	
	// Count how many (and what kind of) resists/weaks a pokémon have, returning
	// an array of objects with obj.name being the type and obj.doubleEffect, etc
	// being the respective resists/weaks.
	var countEachTypeEffect = function (effectivenessArray) {
		var totalResistsWeaks = [];
		
		effectivenessArray.forEach(function (el, index) {						
			totalResistsWeaks.push(effectivityTable(el))
		});
		
		return totalResistsWeaks;
	};

	// Used to simplify typeCalc's code. Accumulate resists/weaks count in a main
	// array where each element is an object representing a type.
	var mergeEffects = function (acc, effects) {
		// effects is an array with a bunch of objects, each with obj.name a string
		// representing a type's name.
		
		effects.forEach(function (el, index) {
			acc[index] = acc[index] || [];
			acc[index].push(el);
		});
		
		return acc;
	};
	
	// Used to map an array of strings to an object with effects info. Example:
	//
	// ["doubleEffect", "halfEffect"] -> { doubleEffect: 1, halfEffect: 1 }
	//
	var createEffectsObject = function (ary) {
		var obj = {};
		
		ary.forEach(function (el) {
			obj[el] = obj[el] + 1 || 1;
		});
		
		return obj;
	};
	
	// Implements the functions for getting the weaks/resists count through a
	// MapReduce fashion.
	// 
	// The output is an array with objects representing each type. The keys are 
	// noEffect, quarterEffect, halfEffect, normalEffect, doubleEffect and
	// quadEffect. The values are the total number of occurences of each.
	//
	var	typeCalc = function (team) {
		var resistWeaks = [];
		var count = {};

		// Number of resists/weaks of each pokémon. Filter false values.
		resistWeaks = team.map(matchup).filter(function (el) {
			return el;
		});
		
		// Return each type's number of resists/weaknesses.
		count = resistWeaks.map(countEachTypeEffect);
		count = count.reduce(mergeEffects, [])
		count = count.map(createEffectsObject);
			
		// The output is an array of objects, each with (double|normal|etc)Effect
		// properties.
		return count;
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
		countEachTypeEffect: countEachTypeEffect,
		mergeEffects: mergeEffects,
		createEffectsObject: createEffectsObject,
		typeCalc: typeCalc,
		transpose: transpose,
		dotProduct: dotProduct
	};
}());

// Add calculation ability to the UI.

$(document).ready(function () {
	$("#typecalc button#calculate").click(function () {
		TYPECALC.calculate();
	});
});	