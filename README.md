# gitStream GitHub Action

This GitHub Action enables you to use the gitStream Continuous Merge (CM) script
in your repositories to automate code review workflows. The gitStream CM script
allows you to define custom automations that run whenever someone opens a new
pull request (PR) or makes changes to an existing PR.

## How gitStream Works

gitStream can be configured through one or more CM files inside your git
repository or GitHub/GitLab organization. These CM files, ending with a `.cm`
extension, contain YAML and Jinja2 code that outlines the rules for triggering
and executing automations. The "if this, then that" approach combined with
templating and gitStream-specific functions offers a highly flexible framework
for building custom CM automations.

## Next Steps

If you're ready to start writing automations, check out our guide:
[Write Your First Automation](https://docs.gitstream.cm/quick-start/).

## Reporting Issues

If you encounter any issues with gitStream or these documentation, please check
the [gitStream issues page](https://github.com/linear-b/gitstream/issues) and
create a new issue if it doesn't already exist. We appreciate your feedback and
help in improving gitStream!

## Syntax Highlighting

To add support for `.cm` files in your code editor, see our
[FAQ](https://docs.gitstream.cm/faq/#is-there-cm-syntax-highlighting).

## License

The gitStream GitHub Action is licensed under the Apache License. See
[LICENSE](LICENSE) for more details.
