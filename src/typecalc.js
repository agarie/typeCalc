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
		var	t = this;
		
		// Implementation of the calc steps
		$("#calculate").click(function () {
			
			t.io.walkTheTeam();
		});
	}
};

TYPECALC.io = (function () {
	var	showResultsOnUi = function (damageTable) {
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
			$(base + output).html(damageTable);
		}
	};
	
	var	walkTheTeam = function () {
		var pkmn = $("#typecalc .pokemon");
		
		$.each(pkmn, function(index, value) {
			console.log(index + ": " + value.querySelector("input[name='type-1']").value + " / " + value.querySelector("input[name='type-2']").value)
		});	
	
	};
	
	return {
		showResultsOnUi: showResultsOnUi,
		walkTheTeam: walkTheTeam
	}
}());

TYPECALC.calc = (function () {
	// TYPE_CHART: Constant object which stores the type-chart
	// Organization: rows = attack, colums = defese
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
	
	
	// Return the effectiveness of attackType attacking defenseType
	var	effect = function (attackType, defenseType) {
		var defenseNumber = TYPE_ORDER[defenseType];

		return TYPE_CHART[attackType][defenseNumber];
	};
		
	var	printEffect = function (type, atkOrDef, matrix) {
		var r = "",
		    M = matrix || {};
		
		atkOrDef = atkOrDef || "atk";
		
		// matrix is used mainly for debugging, to see the order of 
		if (atkOrDef === "atk" && M !== matrix) {
			M = TYPE_CHART;
		}
		else if (M !== matrix) {
			M = this.transpose(TYPE_CHART);
		}
		
		for (var key in TYPE_ORDER) {
			if (TYPE_ORDER.hasOwnProperty(key)) {
				r += key + " " + M[type.toLowerCase()][TYPE_ORDER[key]];
				r += "\n";
			}
		}
		
		return r.replace(/\n$/, "");
	};
		
	// Return an array with the effectiveness of given attack type
	var atkEffect = function (type) {
		if (typeof type !== "string" || TYPE_CHART[type] === undefined) {
			return false;
		}
		
		return TYPE_CHART[type.toLowerCase()];
	};
		
	// Returns the effectiveness of all types attacking a type1/type2 pokemon
	var defEffect = function (type1, type2) {
		if (typeof type1 !== "string" || TYPE_CHART[type1] === undefined) {
			return false;
		}
		
		var TRANSPOSED_TYPE_CHART = this.transpose(TYPE_CHART),
		    result = [],
		    ary1 = TRANSPOSED_TYPE_CHART[type1.toLowerCase()],
		    ary2 = (typeof type2 === "string" && type2.length > 0) ? TRANSPOSED_TYPE_CHART[type2.toLowerCase()] : [];
		
		result = this.dotProduct(ary1, ary2) || ary1;
		
		return result;
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
			return false;
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
		effect: effect,
		printEffect: printEffect,
		atkEffect: atkEffect,
		defEffect: defEffect,
		transpose: transpose,
		dotProduct: dotProduct
	};
}());