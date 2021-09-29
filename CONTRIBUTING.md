# Contibuting Guidelines

Happy to have you here. Following are some contributing guidelines that must be followed while contributing to the repository.


## Setting up the environment

 1. Fork the repository on Github.
 2. Run the environment locally:
	 

	    #clone repository
		git clone https://github.com/React-Canvas-Editor/react-canvas-editor.git

		#change directory to the cloned repository
		cd react-canvas-editor

		#create new branch
		git checkout -b [BRANCH_NAME]

		#install dependencies
		npm install

		#start development server
		npm start


 
The server runs on the PORT 3000.
## Submitting a Pull Request

Follwing are the steps that must be followed while generating a pull request:-

1.  Fork the repository on GitHub
2.  Clone the forked repository to your machine
3.  Create a new branch as per the branch naming conventions provided below.
4.  Make your changes and commit them to your local repository
5.  Rebase and push your commits to your GitHub remote fork/repository
6.  Issue a Pull Request to the official repository
## Branch Naming Conventions

The following are the steps you should follow when creating a new branch.

-   Start the branch name with prefixes like fix-, feat-, chore- as mentioned in  [conventional commit messages](https://conventionalcommits.org/)
-   Add a short description of the task.
For example:
	

	    fix/added-a-new-feature

## Commit Guidelines

We follow the [conventional commit messages](https://conventionalcommits.org/) convention for the commits.
### Types


-  `feat` Commits, that adds a new feature 
-  `fix` Commits, that fixes a bug
-   `refactor`  Commits, that rewrite/restructure your code, however does not change any behaviour
    -   `perf`  Commits are special  `refactor`  commits, that improves performance
-   `style`  Commits, that do not affect the meaning (white-space, formatting, missing semi-colons, etc)
-   `test`  Commits, that add missing tests or correcting existing tests
-   `docs`  Commits, that affect documentation only
-   `build`  Commits, that affect build components like build tool, ci pipeline, dependencies, project version, etc
-   `ops`  Commits, that affect operational components like infrastructure, deployment, backup, recovery, etc
-   `chore`  Miscellaneous commits e.g. modifying  `.gitignore`
