## ⚠️ MVP - Solution. API might change.

Optional scripts are not yet supported by [`yarn workspaces`](https://yarnpkg.com/lang/en/docs/workspaces/).
This solution fills the gap as [`yarn`](https://yarnpkg.com/) will crash if at least one workspace doesn't have called script.

#### Instal:

`yarn add -D -W optional-workspaces-command`

#### Usage:

In your `package.json` scripts add:

```json
  "build": "optional-workspaces-command build"
```

This will run command in all packages under `package/{package_dir}` optionally.
In other words, if no `build` script found in `package.json` - dir is skipped.

**Note:** You can also use script without installing via [`npx`](https://www.npmjs.com/package/npx):  
`npx optional-workspaces-command build`

#### Options:

- `--command`, `-c` - command to run optionally. Also this can be passed as first flagless param.
- `--directory`, `-dir`, `-d` - relative path to workspaces directory.
  Also, this can be passed as second flagless param.
