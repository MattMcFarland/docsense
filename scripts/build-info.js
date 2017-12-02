const { resolve: resolvePath } = require('path');
const Git = require('nodegit');

Git.Repository.open(process.cwd())
  .then(getMostRecentCommit)
  .then(addCommitToState)
  .then(fromCommitToInfo('sha'))
  .then(fromCommitToInfo('date'))
  .then(
    keysFromPackageToInfo(
      'name',
      'license',
      'version',
      'description',
      'author',
      'homepage'
    )
  )
  .then(write)
  .catch(console.error);

function getMostRecentCommit(repo) {
  return repo.getBranchCommit('master');
}

function addCommitToState(commit) {
  return { commit, info: {} };
}

function fromCommitToInfo(getter) {
  return function(state) {
    state.info[getter] = state.commit[getter]();
    return state;
  };
}
function keysFromPackageToInfo(...keys) {
  const pkg = require('../package.json');
  return function(state) {
    const infoFromPackage = keys.reduce((acc, key) => {
      return Object.assign(acc, { [key]: pkg[key] });
    }, {});
    Object.assign(state.info, { ...infoFromPackage });
    return state;
  };
}

function write(state) {
  const { writeFileSync } = require('fs');
  const buildPath = resolvePath(__dirname, '../dist/info.json');

  writeFileSync(buildPath, JSON.stringify(state.info, null, 2));
}
