export const SEARCH_USERS = `SELECT
	                                users.username,
	                                users.img,
	                                coalesce(array_length(users.followers,1),0) as followers_count,
	                                count(repos) as repos_count
                                FROM users
                                FULL OUTER JOIN repositories repos
                                ON users.id = repos.user_owner
                                WHERE users.username ILIKE $1
                                GROUP BY users.username,users.img,users.followers`
export const USER_FOLLOWERS = `SELECT
	                                 follower.user_name,
	                                 array_agg(json_build_object(
	                                 	'username',follower.username,
	                                 	'img',follower.img,
	                                 	'followers_count',follower.count,
	                                 	'repos_count',follower.repos_count
	                                 )) as followers
                                 FROM (
                                 	SELECT usrs.username as user_name,
                                 		fllwers.username,
                                 		fllwers.img,
                                 		coalesce(array_length(fllwers.followers,1),0) as count,
                                 		count(fllwers_repos) as repos_count
                                 	FROM users usrs 
                                 	LEFT OUTER JOIN users fllwers 
                                 	ON ARRAY[usrs.id] && fllwers.followed
                                 	LEFT OUTER JOIN repositories fllwers_repos 
                                 	ON fllwers.id = fllwers_repos.user_owner 
                                 	WHERE usrs.id = $1
                                 	GROUP BY 
                                 		fllwers.username,
                                 		fllwers.img,
                                 		fllwers.followers,
                                 		usrs.username
                                 ) as follower 
                                 GROUP BY follower.user_name`
export const PROFILE_INFO = `SELECT
	users.username as user_name,
	users.description as user_description,
	users.img as user_img,
	count(repositories) as repos_count,
	coalesce(array_length(users.followers,1),0) as followers_count,
	coalesce(array_length(users.followed,1),0) as followed_count
FROM users
FULL OUTER JOIN repositories
ON users.id = repositories.user_owner
WHERE users.id = $1
GROUP BY 
	users.username,
	users.description,
	users.img,
	users.followers,
	users.followed;`
