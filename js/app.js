class CalorieTracker {
	#calorieLimit = 0;
	_totalCalories = 0;
	_meals = [];
	_workouts = [];

	constructor() {
		this.#calorieLimit = 2000;
		this._totalCalories = 0;
		this._meals = [];
		this._workouts = [];
	}

	addMeal(meal) {
		this._meals.push(meal);
		this._totalCalories += meal.calories;
	}
	addWorkout(workout) {
		this._workouts.push(workout);
		this._totalCalories -= workout.calories;
	}
}

class Meal {
	constructor(name, calories) {
		this.id = crypto.randomUUID();
		this.name = name;
		this.calories = calories;
	}
}

class Workout {
	constructor(name, calories) {
		this.id = crypto.randomUUID();
		this.name = name;
		this.calories = calories;
	}
}

const tracker = new CalorieTracker();

const breakfast = new Meal('Breakfast', 400);
tracker.addMeal(breakfast);

const run = new Workout('Morning Run', 200);
tracker.addWorkout(run);

// console.log(tracker._meals);
// console.log(tracker._workouts);
// console.log(tracker._totalCalories);