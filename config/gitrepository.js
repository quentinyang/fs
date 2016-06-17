module.exports = {
    //
    angejia: 'git@git.corp.angejia.com:service/angejia.git',
    boss: 'https://git.corp.angejia.com/service/retrx-mgt.git',
    
    "app-site": {
        origin: 'app-site',
        dest: 'public/dist/',
        rule: 'app-site',
        middlePath: 'angejia',
    },

    "app-bureau": {
        origin: 'app-bureau',
        dest: 'public/dist/',
        rule: 'app-bureau',
        middlePath: 'angejia',
    },

    "app-platform": {
        origin: 'app-platform',
        dest: 'public/dist/',
        rule: 'app-platform',
        middlePath: 'angejia',
    },

    "app-crm": {
        origin: 'app-crm',
        dest: 'public/dist/',
        rule: 'app-crm',
        middlePath: 'angejia',
    },

    "retrx-mgt": {
        origin: "./",
        dest: 'public/dist/',
        rule: 'retrx-mgt'
    }
    

}