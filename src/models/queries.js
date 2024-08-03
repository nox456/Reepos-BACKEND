export const SEARCH_USERS = `SELECT
	                                users.username,
	                                users.img,
	                                coalesce(array_length(users.followers,1),0) as followers_count,
	                                count(repos) as repos_count
                                FROM users
                                FULL OUTER JOIN repositories repos
                                ON users.id = repos.user_owner
                                WHERE users.username ILIKE $1
                                GROUP BY users.username,users.img,users.followers`;
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
                                 GROUP BY follower.user_name`;
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
	users.followed;`;

export const REPOSITORIES_FILES = `SELECT
            file.id,
            file.name,
            file.size,
            file.path,
            last_commit.last_commit_title,
            last_commit.last_commit_created_at
FROM (
    SELECT
        f.name, f.size,f.id, f.path
    FROM repositories
    LEFT OUTER JOIN files f
    ON f.repo = repositories.id
    WHERE repositories.id = $1
) as file,
    LATERAL (SELECT c.title as last_commit_title, c.created_at as last_commit_created_at FROM modifications LEFT OUTER JOIN commits c ON c.id = modifications.commit WHERE modifications.file = file.id ORDER BY c.created_at DESC LIMIT 1) as last_commit WHERE file.size != 'N/A'
`;

export const REPOSITORIES_COMMITS = `SELECT
commits.title as title,
contributors.name as author,
commits.created_at as created_at,
commits.hash as hash
FROM
commits
LEFT OUTER JOIN repositories ON (SELECT id FROM repositories WHERE name = $1 AND user_owner = $2) = commits.repo
LEFT OUTER JOIN contributors ON contributors.id = commits.author`;

export const REPOSITORIES_CONTRIBUTORS = `SELECT
contributors.name as name,
last_commit.title as last_commit_title, 
commits_created.count as commits_created
FROM
contributors, LATERAL (SELECT title FROM commits WHERE commits.author = contributors.id ORDER BY created_at DESC LIMIT 1) as last_commit,LATERAL (SELECT count(*) FROM commits WHERE commits.author = contributors.id) as commits_created WHERE contributors.repo = (SELECT id FROM repositories WHERE repositories.name = $1 AND repositories.user_owner = $2)`;
