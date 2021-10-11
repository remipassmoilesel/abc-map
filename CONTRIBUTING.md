# Contributing

This project is licensed under GPL v3, see [LICENSE.txt](./LICENSE.txt) for more details.         

All contributions are welcome, but must follow this guide.       

Please keep in mind that this is a side project, developed at night after often 10 hours of code during the day.   
A lot of things needs to be improved, and code reviews can take a long time.      


## Before starting 

Ensure that your idea is a need that will be shared by other people.            

[Open an issue](https://gitlab.com/abc-map/abc-map/-/issues/new) to discuss it and to avoid unnecessary or duplicate work.              

If not already done, please check the [bottomless well](documentation/5_the_bottomless_well.md) too !         

Please read the [documentation/](documentation) folder before. Don't worry, it's a quick read. You will
learn how to set up your workstation and to start Abc-Map locally.


## Getting started 🏁

- Fork and clone Abc-Map
- Create a new branch, e.g: `feature/better-drawing-tools`, `fix/user-authentication`
- Let the code genius speak

For details, have a look at [Forking Workflow](https://docs.gitlab.com/ee/user/project/repository/forking_workflow.html).


## Before submitting code

- Try it, smarten it
- Add automated tests (unit tests and/or integration tests)
- Proofread it


## Submit your code

Create a Merge Request, target this repository, master branch.  

Pipeline will not pass on a Gitlab shared runner (see https://gitlab.com/abc-map/abc-map/-/issues/4), please ensure 
that at least all tests pass.  


## Master branch is production ready

All code merged in master must be ready to deploy.      

In order to make this possible, all contributions must be carefully reviewed. A code review must include:      
- Meticulous proofreading and understanding of code 
- Manual tests of features 
- Automated test inspection     

What practices are discouraged ?   
- Dead code, useless code, commented code
- Non functional code
- Add a dependency that a function can replace

Since no one is paid yet, code reviews take time.     



