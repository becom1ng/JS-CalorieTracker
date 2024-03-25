class CalorieTracker {
	#calorieLimit = 0;
	#totalCalories = 0;
	#meals = [];
	#workouts = [];

	constructor() {
		this.#calorieLimit = Storage.getCalorieLimit();
		this.#totalCalories = Storage.getTotalCalories();
		this.#meals = Storage.getMeals();
		this.#workouts = Storage.getWorkouts();

		this.#displayCaloriesLimit();
		this.#displayCaloriesTotal();
		this.#displayCaloriesConsumed();
		this.#displayCaloriesBurned();
		this.#displayCaloriesRemaining();
		this.#displayCaloriesProgress();

		document.getElementById('limit').value = this.#calorieLimit;
	}

	// Public methods
	addMeal(meal) {
		this.#meals.push(meal);
		this.#totalCalories += meal.calories;
		Storage.updateTotalCalories(this.#totalCalories);
		Storage.saveMeal(meal);
		this.#displayNewItem('meal', meal);
		this.#render();
	}
	addWorkout(workout) {
		this.#workouts.push(workout);
		this.#totalCalories -= workout.calories;
		Storage.updateTotalCalories(this.#totalCalories);
		Storage.saveWorkout(workout);
		this.#displayNewItem('workout', workout);
		this.#render();
	}
	removeMeal(id) {
		const index = this.#meals.findIndex((meal) => meal.id === id);
		if (index != -1) {
			const meal = this.#meals[index];
			this.#totalCalories -= meal.calories;
			Storage.updateTotalCalories(this.#totalCalories);
			this.#meals.splice(index, 1);
			Storage.removeMeal(id);
			this.#render();
		}
	}
	removeWorkout(id) {
		const index = this.#workouts.findIndex((workout) => workout.id === id);
		if (index != -1) {
			const workout = this.#workouts[index];
			this.#totalCalories += workout.calories;
			Storage.updateTotalCalories(this.#totalCalories);
			this.#workouts.splice(index, 1);
			Storage.removeWorkout(id);
			this.#render();
		}
	}
	setLimit(limit) {
		this.#calorieLimit = limit;
		Storage.setCalorieLimit(limit);
		this.#displayCaloriesLimit();
		this.#render();
	}
	reset() {
		this.#totalCalories = 0;
		this.#meals = [];
		this.#workouts = [];
		Storage.clearAll();
		this.#render();
	}
	loadItems() {
		this.#meals.forEach((meal) => this.#displayNewItem('meal', meal));
		this.#workouts.forEach((workout) =>
			this.#displayNewItem('workout', workout),
		);
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
	// TODO: Fix card styling to be flexible (bootstrap grid?)
	#displayNewItem(type, item) {
		const itemsEl = document.getElementById(`${type}-items`);
		const itemEl = document.createElement('div');
		itemEl.classList.add('card', 'my-2');
		itemEl.setAttribute('data-id', item.id);
		itemEl.innerHTML = `
		<div class="card-body">
		<div class="d-flex align-items-center justify-content-between">
		  <h4 class="mx-1" style="width: 30%">${item.name}</h4>
		  <div
			class="fs-1 bg-${
				type === 'meal' ? 'primary' : 'secondary'
			} text-white text-center rounded-2 px-2 px-sm-5"
		  >
		  ${item.calories}
		  </div>
		  <button class="delete btn btn-danger btn-sm mx-2">
			<i class="fa-solid fa-xmark"></i>
		  </button>
		</div>
	  </div>
		`;
		itemsEl.appendChild(itemEl);
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

class Storage {
	static getCalorieLimit(defaultLimit = 2000) {
		let calorieLimit;
		if (localStorage.getItem('calorieLimit') === null) {
			calorieLimit = defaultLimit;
		} else {
			calorieLimit = +localStorage.getItem('calorieLimit');
		}
		return calorieLimit;
	}
	static setCalorieLimit(calorieLimit) {
		localStorage.setItem('calorieLimit', calorieLimit);
	}

	static getTotalCalories(defaultCalories = 0) {
		let totalCalories;
		if (localStorage.getItem('totalCalories') === null) {
			totalCalories = defaultCalories;
		} else {
			totalCalories = +localStorage.getItem('totalCalories');
		}
		return totalCalories;
	}
	static updateTotalCalories(calories) {
		localStorage.setItem('totalCalories', calories);
	}

	static getMeals() {
		let meals;
		if (localStorage.getItem('meals') === null) {
			meals = [];
		} else {
			meals = JSON.parse(localStorage.getItem('meals'));
		}
		return meals;
	}
	static saveMeal(meal) {
		const meals = Storage.getMeals();
		meals.push(meal);
		localStorage.setItem('meals', JSON.stringify(meals));
	}
	static removeMeal(id) {
		const meals = Storage.getMeals();
		const updatedMeals = meals.filter((meal) => meal.id !== id);
		localStorage.setItem('meals', JSON.stringify(updatedMeals));
	}

	static getWorkouts() {
		let workouts;
		if (localStorage.getItem('workouts') === null) {
			workouts = [];
		} else {
			workouts = JSON.parse(localStorage.getItem('workouts'));
		}
		return workouts;
	}
	static saveWorkout(workout) {
		const workouts = Storage.getWorkouts();
		workouts.push(workout);
		localStorage.setItem('workouts', JSON.stringify(workouts));
	}
	static removeWorkout(id) {
		const workouts = Storage.getWorkouts();
		const updatedWorkouts = workouts.filter((workout) => workout.id !== id);
		localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
	}

	static clearAll() {
		localStorage.removeItem('meals');
		localStorage.removeItem('workouts');
		localStorage.removeItem('totalCalories');
	}
}

class App {
	#tracker = undefined;

	constructor() {
		this.#tracker = new CalorieTracker();
		this.#loadEventListeners();
		this.#tracker.loadItems();
	}

	#loadEventListeners() {
		document
			.getElementById('meal-form')
			.addEventListener('submit', this.#newItem.bind(this, 'meal'));
		document
			.getElementById('workout-form')
			.addEventListener('submit', this.#newItem.bind(this, 'workout'));
		document
			.getElementById('meal-items')
			.addEventListener('click', this.#removeitem.bind(this, 'meal'));
		document
			.getElementById('workout-items')
			.addEventListener('click', this.#removeitem.bind(this, 'workout'));
		document
			.getElementById('filter-meals')
			.addEventListener('keyup', this.#filterItems.bind(this, 'meal'));
		document
			.getElementById('filter-workouts')
			.addEventListener('keyup', this.#filterItems.bind(this, 'workout'));
		document
			.getElementById('reset')
			.addEventListener('click', this.#reset.bind(this));
		document
			.getElementById('limit-form')
			.addEventListener('submit', this.#setLimit.bind(this));
	}

	#newItem(type, e) {
		e.preventDefault();

		const name = document.getElementById(`${type}-name`);
		const calories = document.getElementById(`${type}-calories`);

		// Validate inputs
		if (name.value === '' || calories.value === '') {
			alert('Please fill in all fields.');
			return;
		}

		if (type === 'meal') {
			const meal = new Meal(name.value, +calories.value);
			this.#tracker.addMeal(meal);
		} else {
			const workout = new Workout(name.value, +calories.value);
			this.#tracker.addWorkout(workout);
		}

		name.value = '';
		calories.value = '';

		const collapse = document.getElementById(`collapse-${type}`);
		bootstrap.Collapse.getInstance(collapse).hide();
	}

	#removeitem(type, e) {
		if (
			e.target.classList.contains('delete') ||
			e.target.classList.contains('fa-xmark')
		) {
			if (confirm('Are you sure?')) {
				const id = e.target.closest('.card').getAttribute('data-id');

				type === 'meal'
					? this.#tracker.removeMeal(id)
					: this.#tracker.removeWorkout(id);

				e.target.closest('.card').remove();
			}
		}
	}

	#filterItems(type, e) {
		const text = e.target.value.toLowerCase();
		document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
			const name = item.firstElementChild.firstElementChild.textContent;

			if (name.toLowerCase().indexOf(text) !== -1) {
				item.style.display = 'block';
			} else {
				item.style.display = 'none';
			}
		});
	}

	#setLimit(e) {
		e.preventDefault();

		const limit = document.getElementById('limit');

		if (limit.value === '' || limit.value == 0) {
			alert('Please enter a calorie limit.');
			return;
		}

		this.#tracker.setLimit(+limit.value);
		limit.value = '';

		const modalEl = document.getElementById('limit-modal');
		const modal = bootstrap.Modal.getInstance(modalEl);
		modal.hide();
	}

	#reset() {
		this.#tracker.reset();
		document.getElementById('meal-items').innerHTML = '';
		document.getElementById('workout-items').innerHTML = '';
		document.getElementById('filter-meals').value = '';
		document.getElementById('filter-workouts').value = '';
	}
}

const app = new App();
