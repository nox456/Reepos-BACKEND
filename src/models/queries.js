export const SEARCH_PAGE_USERS = `SELECT
	                                users.username,
	                                users.img,
	                                coalesce(array_length(users.followers,1),0) as followers_count,
	                                count(repos) as repos_count
                                FROM users
                                FULL OUTER JOIN repositories repos
                                ON users.id = repos.user_owner
                                WHERE users.username ILIKE $1
                                GROUP BY users.username,users.img,users.followers`
