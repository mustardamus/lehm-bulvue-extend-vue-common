'use strict'

module.exports = {
  name: 'Frontend Extend with Vue Common Stuff',
  description: 'https://github.com/mustardamus/lehm-bulvue-extend-vue-common',
  delimiters: '<% %>',
  ignore: ['README.md'],

  after: function (srcPath, distPath, variables, utils) {
    console.log(utils.Chalk.yellow('Installing dependencies...'))
    utils.Shell.exec('npm install validator superagent --save')
  }
}
