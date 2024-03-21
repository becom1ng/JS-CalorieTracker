class CalorieTracker {
	#calorieLimit = 0;
	#totalCalories = 0;
	#meals = [];
	#workouts = [];

	constructor() {
		this.#calorieLimit = 2000;
		this.#totalCalories = 0;
		this.#meals = [];
		this.#workouts = [];
	}

	addMeal(meal) {
		this.#meals.push(meal);
		this.#totalCalories += meal.calories;
	}
	addWorkout(workout) {
		this.#workouts.push(workout);
		this.#totalCalories -= workout.calories;
	}

    get totalCalories() {
        return this.#totalCalories;
    }
    get meals() {
        return this.#meals;
    }
    get workouts() {
        return this.#workouts;
    }
    get calorieLimit() {
        return this.#calorieLimit;
    }

    set calorieLimit(limit) {
        this.#calorieLimit = limit;
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

console.log(tracker.meals);
console.log(tracker.workouts);
console.log(tracker.totalCalories);