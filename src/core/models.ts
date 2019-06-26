/**
 * Represents a List of tasks.
 *
 * Can contain any metadata. Tasks are stored elsewhere.
 */
export interface TaskList extends Record<string, any> {
    /**
     * Unique ID for this list.
     *
     * Of the form "$1.$2", where "." denotes a parent-child relationship.
     */
    id: string;

    /**
     * Name of this list.
     */
    name?: string;
}

/**
 * Represents a Task.
 *
 * Can contain any metadata.
 */
export interface Task extends Record<string, any> {
    /**
     * Unique ID for this task.
     */
    id: string;

    /**
     * ID of the list this Task is contained in.
     */
    list_id?: string;

    /**
     * Name of this task.
     */
    name?: string;

    /**
     * Deadline of this task.
     */
    deadline?: Date;
    // TODO: Decide whether to use Luxon

    /**
     * Priority of this task. Higher priorities sort higher in a list of tasks.
     */
    priority?: number;

    /**
     * Whether this task is complete.
     */
    complete?: boolean;
}