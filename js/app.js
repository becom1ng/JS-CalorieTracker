class CalorieTracker {
	#calorieLimit = 0;
	#totalCalories = 0;
	#meals = [];
	#workouts = [];

	constructor() {
		this.#calorieLimit = 1900;
		this.#totalCalories = 0;
		this.#meals = [];
		this.#workouts = [];

		this.#displayCaloriesLimit();
		this.#displayCaloriesTotal();
		this.#displayCaloriesConsumed();
		this.#displayCaloriesBurned();
		this.#displayCaloriesRemaining();
		this.#displayCaloriesProgress();

	}

	// Public methods
	addMeal(meal) {
		this.#meals.push(meal);
		this.#totalCalories += meal.calories;
		this.#render();
	}
	addWorkout(workout) {
		this.#workouts.push(workout);
		this.#totalCalories -= workout.calories;
		this.#render();
	}

	// Private methods
	#displayCaloriesTotal() {
		const totalCaloriesEl = document.getElementById('calories-total');
		totalCaloriesEl.innerHTML = this.#totalCalories;
	}
	#displayCaloriesLimit() {
		const calorieLimitEl = document.getElementById('calories-limit');
		calorieLimitEl.innerHTML = this.#calorieLimit;
	}
	#displayCaloriesConsumed() {
		const caloriesConsumedEl = document.getElementById('calories-consumed');
		const consumed = this.#meals.reduce(
			(total, meal) => total + meal.calories,
			0,
		);
		caloriesConsumedEl.innerHTML = consumed;
	}
	#displayCaloriesBurned() {
		const caloriesBurnedEl = document.getElementById('calories-burned');
		const burned = this.#workouts.reduce(
			(total, workout) => total + workout.calories,
			0,
		);
		caloriesBurnedEl.innerHTML = burned;
	}
	#displayCaloriesRemaining() {
		const caloriesRemainingEl = document.getElementById('calories-remaining');
		const remaining = this.#calorieLimit - this.#totalCalories;
		caloriesRemainingEl.innerHTML = remaining;
	}

	#displayCaloriesProgress() {
		const progressEl = document.getElementById('calorie-progress');
		const width = Math.min(((this.#totalCalories / this.#calorieLimit) * 100), 100);
		progressEl.style.width = `${width}%`;
	}

	#render() {
		this.#displayCaloriesTotal();
		this.#displayCaloriesConsumed();
		this.#displayCaloriesBurned();
		this.#displayCaloriesRemaining();
		this.#displayCaloriesProgress();
	}

	// Private props - getter and setters
	set calorieLimit(limit) {
		this.#calorieLimit = limit;
	}
	get calorieLimit() {
		return this.#calorieLimit;
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

const walk = new Workout('Morning Walk', 160);
tracker.addWorkout(walk);

console.log(tracker.meals);
console.log(tracker.workouts);
console.log(tracker.totalCalories);
