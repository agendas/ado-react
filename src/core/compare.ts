import {Deadline, DeadlineType, Task} from "./models";

export type Comparator<T> = (a: T, b: T) => number;

export function dateFor(deadline: Deadline) {
    switch (deadline.type) {
        case DeadlineType.Date:
            return new Date(1970, 0, deadline.date + 1, 0, 0, 0, 0);
        case DeadlineType.Datetime:
            return new Date(deadline.timestamp * 1000);
        default:
            throw new Error("Unrecognized deadline type");
    }
}

export function daysSince1970(deadline: Deadline) {
    switch (deadline.type) {
        case DeadlineType.Date:
            return deadline.date;
        case DeadlineType.Datetime:
            const date = dateFor(deadline);
            return Math.floor((date.getTime() / (60 * 1000) + date.getTimezoneOffset()) / (24 * 60));
        default:
            throw new Error("Unrecognized deadline type");
    }
}

export function compareDeadlines(a: Deadline, b: Deadline) {
    const aDays = daysSince1970(a);
    const bDays = daysSince1970(b);

    if (aDays < bDays) {
        return -1;
    } else if (aDays > bDays) {
        return 1;
    }

    if (a.type !== DeadlineType.Datetime && b.type !== DeadlineType.Datetime) {
        return 0;
    } else if (a.type !== DeadlineType.Datetime && b.type !== DeadlineType.Datetime) {
        return -1;
    } else if (a.type === DeadlineType.Datetime && b.type !== DeadlineType.Datetime) {
        return 1;
    }

    return Math.sign(dateFor(a).getTime() - dateFor(b).getTime())
}

export function compareTasks(a: Task, b: Task) {
    // Sort tasks without a deadline to the bottom.
    // Otherwise, compare deadlines.
    if (a.deadline && b.deadline) {
        const compareResult = compareDeadlines(a.deadline, b.deadline);
        if (compareResult !== 0) {
            return compareResult;
        }
    } else if (a.deadline && !b.deadline) {
        return -1;
    } else if (!a.deadline && b.deadline) {
        return 1;
    }

    // Sort tasks by priority, then by creation date.
    const priorityResult = Math.sign((a.priority || 0) - (b.priority || 0));
    return priorityResult === 0 ? Math.sign(a.created_at - b.created_at) : priorityResult;
}