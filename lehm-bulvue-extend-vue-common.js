'use strict'

module.exports = {
  name: 'Frontend Extend with Vue Common Stuff',
  description: 'https://github.com/mustardamus/lehm-bulvue-extend-vue-common',
  delimiters: '<% %>',
  ignore: ['README.md'],

  after: function (srcPath, distPath, variables, utils) {
    let dependencies = [
      'validator',
      'superagent'
    ]
    let yesNo = (question) => {
      return [
        {
          type: 'list',
          name: 'answer',
          message: question,
          choices: ['yes', 'no']
        }
      ]
    }

    utils.Inquirer.prompt(yesNo('Install all dependencies')).then((the) => {
      if (the.answer === 'yes') {
        console.log(utils.Chalk.yellow('Installing dependencies...'))
        utils.Shell.exec(`npm install ${dependencies.join(' ')} --save`)
      }
    })
  }
}
