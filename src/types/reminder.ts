import type { OBJECT_ID } from './generic';

export type ReminderStatus = 'active' | 'inactive';
export type ReminderType = 'bookmark'
    | 'collection'
    | 'highlight'
    | 'topic';

export type ReminderInterval = 'none'
    | 'hourly'
    | 'daily'
    | 'bi-weekly'
    | 'weekly'
    | 'monthly'
    | 'quarterly'
    | 'biannual'
    | 'yearly';

export type Reminder = {
    id: OBJECT_ID;
    owner: OBJECT_ID;
    info: {
        name: string;
        status: ReminderStatus;
        description?: string;
    };
    meta: {
        type: ReminderType;

        /**
         * Array of model IDs
         * 
         * Eg: If type is 'collection', this will be an array of collection IDs
         * 
         * If type is 'bookmark', this will be an array of bookmark IDs
         */
        models: OBJECT_ID[];

        /**
         * How often the reminder should fire
         */
        interval: ReminderInterval;
    };

    /**
     * unix timestamp
     */
    dueDate: number;
    updatedAt: Date;
    createdAt: Date;
}
