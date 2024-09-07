export interface Project {
	id: string;
	title: string;
	description: string;
	todo_groups?: TodoGroup[];
}

export interface TodoGroup {
	id: string;
	title: string;
	description: string;
	progress: number;
	todos: Todo[];
}

export interface Todo {
	id: string;
	title: string;
	description: string;
	completed: boolean;
}
