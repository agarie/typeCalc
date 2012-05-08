TestCase("CalcTest", {
	setUp: function() {
		this.calc = TYPECALC.calc;
		
	  this.type1 = "water";
		this.type2 = "steel";
		this.type3 = "ice";
		this.type4 = "ghost";
		this.type5 = "normal";
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
		assertNotUndefined(this.calc.matchup("normal").length);
		assertArray(this.calc.matchup("normal"));
		
		assertNotUndefined(this.calc.matchup("normal", "fire").length);
		assertArray(this.calc.matchup("normal", "fire"));
	},
	
	// weakness, mapEffectivity and reduceWeaknesses
	
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