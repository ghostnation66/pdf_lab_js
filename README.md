<<<<<<< HEAD
# Upcoming patch updates

Patch 1: Rework numberingGrid to reduce HTML footprint
Patch 2: Alphabetize all CSS rules
Patch 3: Separate all source.js functions into modules

# Upcoming major updates

Major 1: Design text reflow system to automatically reflow the text of numberingGrids and HTML elements within the dual-column element
Major 2: Create a scraper that is provided an HTML element as an argument and generates a javascript object representation of it (with accurate nesting features). This can be used in later reflow projects to scan for specific class elements and reflow them to other elements (directed graph based reflow, pointing like a doubly-linked list)
Major 3: Develop the pdf_lab_js wiki using shot-scraper to extract individual CSS elements and display images of them in a search-able file-system which enables the user to type in the CSS selector and find a PNG representation of the output.

# Sheets of Paper

Word processor in your browser using HTML and CSS (e.g. for invoices, legal notices, etc.)

 * Poor man's Google Docs
 * Like the foundation of Microsoft Word or LibreOffice — but in your web browser
 * Emulates sheets of paper in web documents (but without skeuomorphic paper textures)

[**Live demo**](https://delight-im.github.io/HTML-Sheets-of-Paper/): Try modifying or printing the page

## Usage

 1. Copy all files to any desired directory
 2. Modify the HTML source in [`index.html`](index.html) to your liking

## Browser compatibility

 * Chrome 4+
 * Firefox 19+
 * Safari 5+
 * Opera 10.1+
 * Internet Explorer 9+
 * Edge 12+

## Paper sizes

 * `A4` (21cm × 29.7cm) — `sheets-of-paper-a4.css`
 * `A3` (29.7cm × 42cm) — `sheets-of-paper-a3.css`
 * `US Letter` (21.6cm × 27.9cm) — `sheets-of-paper-usletter.css`
 * `US Legal` (21.6cm × 35.6cm) — `sheets-of-paper-uslegal.css`
 * `US Tabloid` (27.9cm × 43.2cm) — `sheets-of-paper-ustabloid.css`

### Landscape orientation

 1. In the `css/sheets-of-paper-*.css` variant that you’re using:
    1. Swap the values of `width` and `min-height`
    1. Set the second value of the `size` attribute to `landscape`
 1. In `index.html`, set `Config.pageHeightInCentimeter` to your new `min-height` value from above

## Printing

### Chrome

 * Change the `Destination` to `Save as PDF`.
 * Make sure the `Paper size` is set to the one defined in your CSS.
 * From the `Margins` list, choose `None` to prevent the browser from overriding our CSS.
 * In the `Options` section, uncheck `Headers and footers` and check `Background colors and images`.

## License

This project is licensed under the terms of the [MIT License](https://opensource.org/licenses/MIT).
=======
# pdf_lab



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/6urnwave/pdf_lab.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/6urnwave/pdf_lab/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
>>>>>>> 78973a8 (Initial commit)
