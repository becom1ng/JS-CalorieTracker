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
		const progressEl = document.getElementById('calorie-progress');
		const remaining = this.#calorieLimit - this.#totalCalories;
		caloriesRemainingEl.innerHTML = remaining;

		if (remaining < 0) {
			caloriesRemainingEl.parentElement.parentElement.classList.remove(
				'bg-light',
			);
			caloriesRemainingEl.parentElement.parentElement.classList.add(
				'bg-danger',
			);
			progressEl.classList.remove('bg-success');
			progressEl.classList.add('bg-danger');
		} else {
			caloriesRemainingEl.parentElement.parentElement.classList.remove(
				'bg-danger',
			);
			caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
			progressEl.classList.remove('bg-danger');
			progressEl.classList.add('bg-success');
		}
	}
	#displayCaloriesProgress() {
		const progressEl = document.getElementById('calorie-progress');
		const width = Math.min(
			(this.#totalCalories / this.#calorieLimit) * 100,
			100,
		);
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

class App {
	#tracker = undefined;

	constructor() {
		this.#tracker = new CalorieTracker();

		document
			.getElementById('meal-form')
			.addEventListener('submit', this.#newMeal.bind(this));
		document
			.getElementById('workout-form')
			.addEventListener('submit', this.#newWorkout.bind(this));
	}

	#newMeal(e) {
		e.preventDefault();

		const name = document.getElementById('meal-name');
		const calories = document.getElementById('meal-calories');

		// Validate inputs
		if (name.value === '' || calories.value === '') {
			alert('Please fill in all fields.');
			return;
		}

		const meal = new Meal(name.value, +calories.value);
		this.#tracker.addMeal(meal);

		name.value = '';
		calories.value = '';

		const collapseMeal = document.getElementById('collapse-meal');
		bootstrap.Collapse.getInstance(collapseMeal).hide();
	}
	#newWorkout(e) {
		e.preventDefault();
		
		const name = document.getElementById('workout-name');
		const calories = document.getElementById('workout-calories');
		
		// Validate inputs
		if (name.value === '' || calories.value === '') {
			alert('Please fill in all fields.');
			return;
		}
		
		const workout = new Workout(name.value, +calories.value);
		this.#tracker.addWorkout(workout);
		
		name.value = '';
		calories.value = '';
		
		const collapseWorkout = document.getElementById('collapse-workout');
		bootstrap.Collapse.getInstance(collapseWorkout).hide();
	}
}

const app = new App();
