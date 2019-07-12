/**
 * Represents a List of tasks.
 *
 * Can contain any metadata. Tasks are stored elsewhere.
 */
export interface TaskList extends Record<string, any> {
    /**
     * Unique ID for this list.
     */
    id: string;

    /**
     * Name of this list.
     */
    name?: string;

    /**
     * Location of this list.
     *
     * Of the form "$1.$2", where "." denotes a parent-child relationship.
     */
    location: string;
}

/**
 * Type of deadline.
 */
export enum DeadlineType {
    /**
     * The deadline only refers to a date.
     */
    Date = 0,

    /**
     * The deadline refers to a specific date and time.
     */
    Datetime = 1
}

/**
 * Deadline which only refers to a date.
 */
export interface DateDeadline {
    type: DeadlineType.Date;

    /**
     * Number of days since January 1, 1970.
     */
    date: number;
}

/**
 * Deadline which refers to a specific date and time.
 */
export interface TimeDeadline {
    type: DeadlineType.Datetime;

    /**
     * Number of seconds since January 1, 1970 at 12am UTC.
     */
    timestamp: number;
}

/**
 * Represents a generic deadline.
 */
export type Deadline = DateDeadline | TimeDeadline;

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
     * Name of this task.
     */
    name?: string;

    /**
     * Deadline of this task.
     */
    deadline?: Deadline;

    /**
     * Priority of this task. Higher priorities sort higher in a list of tasks.
     */
    priority?: number;

    /**
     * Whether this task is complete.
     */
    complete?: boolean;

    /**
     * When this task was created, stored as a Unix timestamp.
     */
    created_at: number;
}