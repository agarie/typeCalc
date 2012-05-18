TestCase("CalcTest", {
	setUp: function() {
		this.calc = TYPECALC.calc;
		
	  this.type1 = "water";
		this.type2 = "steel";
		this.type3 = "ice";
		this.type4 = "ghost";
		this.type5 = "normal";
		
		this.effectArray = [1, 0.5, 2, 1, 0.5, 0.5, 1, 1, 2, 1, 1, 0.5, 2, 1, 1, 1, 0.5];
	},
	
	"test calc.calc should be an object": function () {
		assertObject(this.calc);
	},
	
	"test constant TYPES should be hidden": function () {
		assertUndefined(this.calc.TYPES);
	},
	
	"test constant TYPE_ORDER should be hidden": function() {
		assertUndefined(this.calc.TYPE_ORDER);
	},
	
	"test constant TYPE_CHART should be hidden": function() {
		assertUndefined(this.calc.TYPE_CHART);
	},
	
	"test matchup should return array": function () {
		assertNotUndefined(this.calc.matchup(["water"]).length);
		assertArray(this.calc.matchup(["water"]));
		
		assertNotUndefined(this.calc.matchup(["normal", "psychic"]).length);
		assertArray(this.calc.matchup(["normal", "psychic"]));
	},
	
	"test matchup should return correct effectiveness array": function () {
		assertEquals(this.effectArray, this.calc.matchup(["fire"]));
	},
	
	"test effectCount should return object": function () {
		assertObject(this.calc.effectCount(this.effectArray));
	},
	
	"test effectCount should return obj with non-zero properties": function () {
		var count = {
			halfEffect: 5,
			normalEffect: 9,
			doubleEffect: 3,
		};
		
		assertEquals(count, this.calc.effectCount(this.effectArray));
	},
	
	"test typeCalc should work properly without options object": function () {
		var team = [];
		
		team.concat(["fire", "dragon"]);

		assertNotUndefined(this.calc.typeCalc(team));
	},
	
	"test typeCalc should return an array if partialCount is true": function () {
		var team = [];
		
		for (var i = 0; i < 6; i++) {
			team.concat(this.effectArray);
		}

		assertArray(this.calc.typeCalc(team, { partialCount: true }));
	},
	
	"test typeCalc should return an obj if partialCount isn't true": function () {
		var team = [];
		
		for (var i = 0; i < 6; i++) {
			team.concat(this.effectArray);
		}

		assertObject(this.calc.typeCalc(team, { partialCount: false }));
		assertObject(this.calc.typeCalc(team, { partialCount: undefined }));
	},
	
	"test transpose should return false if input isn't object": function () {
		assertFalse(this.calc.transpose([]));
	},
	
	"test transpose should return false if the matrix is degenerated": function () {
		assertFalse(this.calc.transpose({}));
		assertFalse(this.calc.transpose({key: [], key2: []}));
	},
	
	"test transpose should return correct matrix": function () {
		assertEquals({key1: [1, 2, 3], key2: [4, 5, 6], key3: [7, 8, 9]}, this.calc.transpose({key1: [1, 4, 7], key2: [2, 5, 8], key3: [3, 6, 9]}));
	},
	
	"test dotProduct should return an array": function () {
		assertNotUndefined(this.calc.dotProduct([1, 2], [3, 7]));
	},
	
	"test dotProduct should return undefined if arrays' dimensions differ": function () {
		assertUndefined(this.calc.dotProduct([1, 2, 3], [4, 5]));
	},
	
	"test dotProduct should return correct result": function () {
		assertEquals([1, 14, 9, 55], this.calc.dotProduct([1, 2, 3, 5], [1, 7, 3, 11]));
	},
	
	"test dotProduct(a, b) = dotProduct(b, a)": function () {
		assertEquals(this.calc.dotProduct("normal", "steel"), this.calc.dotProduct("steel", "normal"));
	}
});