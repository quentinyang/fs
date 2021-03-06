module.exports = {

    repository: {
        // mixed repository
        "angejia": "git@git.corp.angejia.com:service/angejia.git",
        "fy360-service": "git@git.corp.angejia.com:fangyuan360/fy360-service.git",

        // platform == repository index
        "retrx-mgt": "git@git.corp.angejia.com:service/retrx-mgt.git",
        "newboss": "git@git.corp.angejia.com:service/newboss.git",
    },

    "app-site": {
        origin: "app-site",
        dest: "public/dist/",
        rule: "app-site",
        middlePath: "angejia",
    },

    "app-bureau": {
        origin: "app-bureau",
        dest: "public/dist/",
        rule: "app-bureau",
        middlePath: "angejia",
    },

    "app-platform": {
        origin: "app-platform",
        dest: "public/dist/",
        rule: "app-platform",
        middlePath: "angejia",
    },

    "app-crm": {
        origin: "app-crm",
        dest: "public/dist/",
        rule: "app-crm",
        middlePath: "angejia",
    },

    // 生态圈cms
    "app-cms": {
        origin: "app-cms",
        dest: "public/dist/",
        rule: "app-cms",
        middlePath: "fy360-service",
    },

    "retrx-mgt": {
        origin: "./",
        dest: "public/dist/",
        rule: "retrx-mgt"
    },

    "newboss": {
        origin: "./",
        dest: "public/dist/",
        rule: "newboss"
    }

}
