export type ReminderStatus = "active" | "inactive";
export type ReminderType = "bookmark"
    | "collection"
    | "highlight"
    | "topic";

export type ReminderInterval = "none"
    | "hourly"
    | "daily"
    | "bi-weekly"
    | "weekly"
    | "monthly"
    | "quarterly"
    | "biannual"
    | "yearly";

export type Reminder = {
    id: string;
    owner: string;
    info: {
        name: string;
        status: ReminderStatus;
        description?: string;
    };
    meta: {
        models: string[];
        type: ReminderType;
        interval: ReminderInterval;
    };
    dueDate: number;
    updatedAt: string | number | Date;
    createdAt: string | number | Date;
}
