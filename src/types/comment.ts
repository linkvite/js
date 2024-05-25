import type {RoleLevel} from '.';

export type CommentStatus = 'active' | 'hidden';

export type Comment = {
	/**
	 * The public ID of the comment
	 *
	 * Always prefixed with `com_`
	 */
	id: string;

	/**
	 * The ID of the user who created the comment
	 */
	user_id: string;

	/**
	 * The content of the comment
	 */
	content: string;

	/**
	 * The status of the comment
	 *
	 * - `active` - The comment is active and visible
	 * - `hidden` - The comment is hidden from public view
	 */
	status: CommentStatus;

	/**
	 * If the comment is a reply, the ID of the parent comment
	 *
	 * If the comment is not a reply, this will be `null`
	 */
	parent_id: string | null;

	/**
	 * The ID of the bookmark the comment is on
	 */
	bookmark_id: string;

	/**
	 * The date the comment was created
	 */
	created_at: Date;

	/**
	 * The date the comment was last updated
	 */
	updated_at: Date;

	/**
	 * If the current user has liked the comment
	 */
	liked: boolean;

	/**
	 * The role of the user who is viewing the comment
	 *
	 * This is used to determine if the user can edit or delete the comment
	 *
	 * Note that comment owners will always have a role of `admin`
	 */
	role: RoleLevel;

	/**
	 * The number of likes the comment has
	 */
	likes_count: number;

	/**
	 * The number of replies the comment has
	 */
	replies_count: number;

	/**
	 * The ID of the user who created the comment
	 */
	owner_id: string;

	/**
	 * The name of the user who created the comment
	 */
	owner_name: string;

	/**
	 * The username of the user who created the comment
	 */
	owner_username: string;

	/**
	 * The display picture of the user who created the comment
	 */
	owner_avatar: string;
};
