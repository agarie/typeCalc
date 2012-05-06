TestCase("TypeChartTest", {
	setUp: function() {
	  this.type1 = "water";
		this.type2 = "steel";
		this.type3 = "ice";
		this.type4 = "ghost";
		this.type5 = "normal";
	},
	
	"test TYPECALC should be an object": function () {
		assertObject(TYPECALC);
	},
	
	"test constant TYPE_ORDER should be hidden": function() {
		assertUndefined(TYPECALC.TYPE_ORDER);
	},
	
	"test constant TYPE_CHART should be hidden": function() {
		assertUndefined(TYPECALC.TYPE_CHART);
	},
	
	"test effect should return number": function() {
		assertNumber(TYPECALC.effect(this.type1, this.type2));
		assertNumber(TYPECALC.effect(this.type1, this.type3));
		assertNumber(TYPECALC.effect(this.type2, this.type3));
	},
	
	"test effect should return 0, 0.5, 1 or 2": function() {
		assertEquals(0, TYPECALC.effect(this.type5, this.type4));
		assertEquals(0.5, TYPECALC.effect(this.type2, this.type1));
		assertEquals(1, TYPECALC.effect(this.type1, this.type2));
		assertEquals(2, TYPECALC.effect(this.type2, this.type3));
	},
	
	"test atkEffect should return false if input isn't string of a valid type": function () {
		assertFalse(TYPECALC.atkEffect("invalid"));
		assertFalse(TYPECALC.atkEffect({}));
	},
	
	"test atkEffect should return an array with length 17": function () {
		assertNotUndefined(TYPECALC.atkEffect("water").length);
		assertEquals(17, TYPECALC.atkEffect("poison").length);
	},
	
	"test atkEffect should return correct array for 1 type": function () {
		assertEquals([1, 2, 1, 1, 1, 2, 0.5, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 0.5], TYPECALC.atkEffect("rock"));
	},
	
	"test getArrayOfDefEfect should return array": function () {
		assertNotUndefined(TYPECALC.defEffect("normal").length);
		assertNotUndefined(TYPECALC.defEffect("normal", "fire").length);
	},
	
	"test transpose should return false if input isn't object": function () {
		assertFalse(TYPECALC.transpose([]));
	},
	
	"test transpose should return false if the matrix is degenerated": function () {
		assertFalse(TYPECALC.transpose({}));
		assertFalse(TYPECALC.transpose({key: [], key2: []}));
	},
	
	"test transpose should return correct matrix": function () {
		assertEquals({key1: [1, 2, 3], key2: [4, 5, 6], key3: [7, 8, 9]}, TYPECALC.transpose({key1: [1, 4, 7], key2: [2, 5, 8], key3: [3, 6, 9]}));
	},
	
	"test dotProduct should return an array": function () {
		assertNotUndefined(TYPECALC.dotProduct([1, 2], [3, 7]));
	},
	
	"test dotProduct should return false if arrays' dimensions differ": function () {
		assertFalse(TYPECALC.dotProduct([1, 2, 3], [4, 5]));
	},
	
	"test dotProduct should return correct result": function () {
		assertEquals([1, 14, 9, 55], TYPECALC.dotProduct([1, 2, 3, 5], [1, 7, 3, 11]));
	},
	
	"test dotProduct(a, b) = dotProduct(b, a)": function () {
		assertEquals(TYPECALC.dotProduct("normal", "steel"), TYPECALC.dotProduct("steel", "normal"));
	}
});