# README #

Test Management Service

## What is this repository for? ##

Repository provide backend for Test Management Service.

Service contains full RESTFull json -API, as well as websockets.
Also there is (not yet implemented) several kind of backend-services, like scheduler, result-analyser, report-generator, suite-generator, ...

## Service resources (with API) are ##
* Accounts
* Groups
* Admin
* Test Cases
* Product features
* Campaigns
* Test Automation
** Jobs
* Resources
** DUT's
** LAB equipments
** Rooms
* Builds
* Test Results
* Reports
** Report template's
* Addons

### Accounts ###
(not yet fully implemented)
Accounts provide information and configuration related individual accounts. It also give authentication and access policy. External authentication methods, like github/google/... can be easily to integrate to provide simple and easy login -mechanism.

### Groups ###
(not yet fully implemented)
Groups provide access policy to other API's. Access policy is very similar than linux has, we have users (=Accounts), groups and others.
### admin -API ###
admin API is allowed only admin -users. It provide remote control service configuration. For example, it can be use to install new addons, or control addon configurations. 

### Test Case ###
Test Case provide global registry for Test Case -related informations. Informations are for example TC type, owner, features under test (FUT), components under test (CUT), requirements, specification, etc. It could contains also TC implementation, or at least it should contain detail where implementation can be found (url). Test Case API could be extended also to fetch actual test implementation from GIT for example.

### Product Features ###
Product features give possibility to create feature-tree and manage features accross the test and product development life. Feature API (not yet implemented) provide also easy access to all related testcases. Feature tree is generally very usefull for test planning point of view, it gives brief view, what kind of features we have, and what features we not coverage in tests.

### Campaings ###
Campaign are list of testcases. Campaign collect sertain amount or pre-defined types of test cases to one place. Campaign not neccessary have to be "static list" of test cases, it can be use dynamically so that all new testcases automatically belong to existing campaign as soon as test case information match to campaign specification. Campaign API provide easy access to manage campaign specification.

### Test Automation ###
(not yet implemented)
Test Automation is new intelligent way to manage test execution phase.
It contains rules like what should be test for each build. Backend contains job scheduler, which map test execution to most optimal resource we have in this system.

#### Jobs ####
Job contains information what should be done in Slave machine. For example, it could contains information like what test cases should be run in this type of DUT, or this software X should be update to version Y. So there is several different job types like "maintenance-job", "test-job", etc.. 

### Resources ###
(partially implemented)
Resource is physical resource, what is Limited amount.
Resource document contains all informations related Resource itself, like resource type, model, vendor, location, owner, administrator, ip-address, ...

#### DUT ####
Dut (Device Under Type) is special type of resource. It is used in test cases: list of allowed DUT's for particular TC..

#### LAB equipments ####
LAB equipments are just one example of resource type.

#### Rooms ####
Room is also one example of resource type. We can map easily each resources to a rooms and collect list of all resources which is in that room. This way we can also easily fetch how much power is used in that room (of course if all resources has that kind of information). That information for example can be use to planning air conditions for rooms.

### Builds ###
Builds provide API to collect all CI artifacts to one common place. Also it provide easy way to query builds and fetch binary directly via Builds API. Also several kind of statistics can be also fetch from that API.

### Test Results ###
Test Result contains all information related Test Execution phase, like final verdict, traces/logs, Build Under test, Device Under Test, etc. These information can be use to reply test execution phase easily.


### Reports ###
(not yet implemented)
Report is like snapshot of datbase state in certain time period. Reports cannot be change afterward. Reports can be use any (some exceptions) other API's to fetch actual data to report. For example we could create Test Report from Test Results, or Test Case Report from Test Cases.

#### Reports template ####
(not yet implemented)
Report templates contains specification for Actual Report. Report template is like "view-template" which descibe how actual Report should look like. Report types can be for example
* PDF
* HTML
* Excel
* Word

### Addons ###
(partially implemented)
Way to extend this backend-service easily. Addon registry (future plan) contains information about existing addons, which can easily to install via administrator API.
There is available several example addons like:
* gui (first web-ui revision)
* github (github-repository integraiton)
* jenkins (jenkins-integration)
* slack (Slack messaging integration)
* test-suites (Allows to generate test suites from campaign)
* sample (just for example)

### How do I get set up? ###

* Summary of set up
* Configuration
`npm install`
* Dependencies
* Database configuration
* How to run tests
`npm test`
* How to start service
`npm start`
* Deployment instructions
`supervisor -wa . -n exit server.js`


### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact