/**
 * @typedef {Object} Validation
 * @property {?string} error - Error message
 * @property {*} data - Data
 * */
/**
 * @typedef {Object} BranchData
 * @property {string} name - Branch name
 * @property {string} repo - Repository ID
 * @property {string} type - Branch type
 *
 * The branch saved data
 * @typedef {Object} BranchType
 * @property {string} id - Branch ID
 * @property {string} name - Branch name
 * @property {string} repo - Repository ID
 * @property {string} type - Branch Type
 * */
/**
 * @typedef {Object} CommitData
 * @property {string} title - Commit title
 * @property {string} content - Commit content
 * @property {string} hash - Commit hash
 * @property {string} author - Author ID
 * @property {string} created_at - Date of creation
 * @property {string} repo - Repository ID
 *
 * @typedef {Object} CommitType
 * @property {string} id - Commit ID
 * @property {string} title - Commit title
 * @property {string} content - Commit content
 * @property {string} hash - Commit hash
 * @property {string} author - Author ID
 * @property {string} created_at - Date of creation
 * @property {string} repo - Repository ID
 * */
/**
 * @typedef {Object} Commit
 * @property {string} title - Commit title
 * @property {string} author - Commit author
 * @property {string} created_at - Date of creation
 * @property {string} hash - Commit hash
 * */
/**
 * @typedef {Object} ContributorData
 * @property {string} name - Contributor name
 * @property {string} repo - Repository ID
 *
 * @typedef {Object} ContributorType
 * @property {string} id - Contributor ID
 * @property {string} name - Contributor name
 * @property {string} repo - Repository ID
 * */
/**
 * @typedef {Object} Contributor
 * @property {string} name - Contributor name
 * @property {string} last_commit_title - Last commit of contributor
 * @property {string} commits_created - Commits created by contributor
 * */
/**
 * @typedef {Object} FileData
 * @property {string} name - File name
 * @property {string} size - File size
 * @property {string} path - File path
 * @property {string} repo - Repository ID
 *
 * @typedef {Object} FileType
 * @property {string} id - File ID
 * @property {string} name - File name
 * @property {string} size - File size
 * @property {string} path - File path
 * @property {string} repo - Repository ID
 * */
/**
 * @typedef {Object} LastCommit
 * @property {string} title - Last commit title
 * @property {string} created_at - Date of creation
 *
 * @typedef {Object} FileInfo
 * @property {string} name - File name
 * @property {string} size - File size
 * @property {string} path - File path
 * @property {string} content - File content
 * @property {string} language - Language name
 * @property {LastCommit} last_commit - Last commit
 * */
/**
 * @typedef {Object} ModificationData
 * @property {string} type - Modification type ("A", "M", "D")
 * @property {string} commit - Commit ID
 * @property {string} file - File ID
 *
 * @typedef {Object} ModificationType
 * @property {string} id - Modification ID
 * @property {string} type - Modification type ("A", "M", "D")
 * @property {string} commit - Commit ID
 * @property {string} file - File ID
 * */
/**
 * @typedef {Object} RepoData
 * @property {string} name - Repository Name
 * @property {string} description - Repository Description
 * @property {string} user_owner - User owner ID
 *
 * @typedef {Object} RepoType
 * @property {string} id - Repository ID
 * @property {string} name - Repository name
 * @property {string} description - Repository Description
 * @property {string} user_owner - User owner ID
 * @property {string} created_at - Date of creation
 * @property {int} likes - Count of likes
 * */
/**
 * @typedef {Object} File
 * @property {string} id - File ID
 * @property {string} name - File name
 * @property {string} size - File size
 * @property {string} path - File path
 * @property {string} last_commit_title - Title of the last commit
 * @property {string} last_commit_created_at - Date of creation of the last commit
 * @property {string} url - Public url of the file
 * */
/**
 * @typedef {Object} RepositoryFounded
 * @property {string} user - User owner name
 * @property {string} name - Repository name
 * @property {string} description - Repository description
 * @property {int} likes - Repository likes
 * @property {string[]} languages - Repository languages
 * */
/**
 * @typedef {Object} Branch
 * @property {string} name - Branch name
 * @property {string} type - Branch type
 *
 * @typedef {Object} LastCommit
 * @property {string} title - Last commit title
 * @property {string} created_at - Date of creation
 * @property {string} author - Author name
 *
 * @typedef {Object} RepoInfo
 * @property {string} name - Repository name
 * @property {string} description - Repository description
 * @property {int} likes - Repository likes
 * @property {string[]} languages - Repository languages
 * @property {int} commits_count - Repository commits
 * @property {int} contributors_count - Repository contributors
 * @property {Branch[]} branches - Repository branches
 * @property {LastCommit} last_commit - Last commit of repository
 * */
/**
 * @typedef {Object} Repository
 * @property {string} name - Repository name
 * @property {string} description- Repository description
 * @property {int} likes - Repository likes
 * @property {string[]} languages - Repository languages
 * */
/**
 * @typedef {Object} UserData
 * @property {string} username - User name
 * @property {string} password - User password
 * */
/**
 * @typedef {Object} UserType
 * @property {string} id - User ID
 * @property {string} username - User name
 * @property {string} password - User password
 * @property {string} description - User description
 * @property {string} created_at - Date of creation
 * @property {string} img - URL of user image
 * */
/**
 * @typedef {Object} UserSearched
 * @property {string} usename - User name
 * @property {string} img - User image URL
 * @property {int} followers_count - Followers count
 * @property {int} repos_count - Repositories count
 * */
/**
 * @typedef {Object} Follower
 * @property {string} username - Follower name
 * @property {string} img - Follower image URL
 * @property {int} followers_count - Followers count of the follower
 * @property {int} repos_count - Repositories count of the follower
 * */
/**
 * @typedef {Object} ProfileInfo
 * @property {string} user_name - User name
 * @property {string} user_description - User description
 * @property {string} user_img - User image URL
 * @property {int} repos_count - Repositories count
 * @property {int} followers_count - Followers count
 * @property {int} followed_count - Followed count
 * */
/**
 * @typedef {Object} ErrorType
 * @property {string} message - Error message
 * @property {string} type - Error Type
 *
 * @typedef {Object} ServiceResult
 * @property {boolean} success
 * @property {?ErrorType} error - Error object
 * @property {*} data - Result Data
 * */
export {};
