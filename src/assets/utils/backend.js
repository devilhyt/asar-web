let def = {
    method: 'GET',
    url: '/api/',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body_type: "json",
    response_type: "json"
}

function check_body(body, body_type) {
    if (body != null) {
        switch (body_type) {
            case "json":
                return JSON.stringify(body)
            case "string":
                return body
        }
    }
    return null
}

function format(data, response_type){
    switch (response_type) {
        case "json":
            return data.json()
        case "text":
            return data.text()
    }
}

async function apiFetch({url = def.url, route = '', method = def.method, headers = def.headers, body = null, body_type = def.body_type, response_type = def.response_type}={}){
    
    let data = ""

    await fetch(url+route, {
        method: method,
        headers: headers,
        body: check_body(body, body_type)
    })
    .then(response => {
        data = response
    })
    response_data = format(data, response_type)

    return response_data
    
}

async function login(username, password){
    let body = {
        "username": username,
        "password": password
    }
    let response = await apiFetch({method: 'POST', route: 'auth', body: body});
    return response
}

async function logout(){
    let response = apiFetch({method: 'DELETE', route: 'auth'});
    return response
}

async function createProject(project){
    let body = {
        "project_name": project
    }
    let response = await apiFetch({method: 'POST', route: 'projects', body: body});
    return response
}

async function deleteProject(project){
    let response = await apiFetch({method: 'DELETE', route: 'projects/' + project});
    return response
}

async function getProjectList(){
    let response = await apiFetch({method: 'GET', route: 'projects'});
    return response["project_names"]
}

async function createFile(params, fileName){
    const route = "projects/" + params.projectName + "/" + params.fileType
    let body = {
        "name": fileName
    }
    let response = await apiFetch({method: 'POST', route: route, body: body});
    return response
}

async function deleteFile(params, file_name) {
    const route = "projects/" + params.projectName + "/" + params.fileType + "/" + file_name
    let response = await apiFetch({method: 'DELETE', route: route});
    return response
}

async function getFileList(params, file_type){
    const route = 'projects/' + params.projectName + "/" + file_type + "?mode=name"
    let response = await apiFetch({method: 'GET', route: route});
    return response
}

async function getFileData(params, file_type){
    const route = 'projects/' + params.projectName + "/" + file_type + "/" + params.fileName
    let response = await apiFetch({method: 'GET', route: route});
    return response
}

async function getAllFileData(params, file_type){
    const route = 'projects/' + params.projectName + "/" + file_type
    let response = await apiFetch({method: 'GET', route: route});
    return response
}

async function updateFile(params, file_type, body){
    const route = 'projects/' + params.projectName + "/" + file_type + "/" + params.fileName
    let response = await apiFetch({method: 'PUT', route: route, body: body});
    return response
}

async function getLocalConfig(projectName){
    const route = 'projects/' + projectName + "/lconfigs"
    let response = await apiFetch({method: 'GET', route: route, response_type: "text"});
    return response
}

async function updateLocalConfig(projectName, text){
    const headers = {
        "Content-Type": "text/x-yaml",
        "Accept": "text/x-yaml"
    }
    const route = 'projects/' + projectName + "/lconfigs"
    let response = await apiFetch({method: 'PUT', headers:headers, route: route, body: text, body_type:"string"});
    return response
}

async function getBuiltinActionList(params){
    const route = 'projects/' + params.projectName + "/actions?mode=builtin"
    let response = await apiFetch({method: 'GET', route: route});
    return response
}

async function getBuiltinIntentList(params){
    const route = 'projects/' + params.projectName + "/intents?mode=builtin"
    let response = await apiFetch({method: 'GET', route: route});
    return response
}

async function getRasaStatus(){
    const route = 'models'
    let response = await apiFetch({method: 'GET', route: route});
    return response
}

async function trainModel(name){
    const route = 'models'
    let response = await apiFetch({method: 'POST', route: route, body: {project_name: name}});
    return response
}

async function loadModel(name){
    const route = 'models'
    let response = await apiFetch({method: 'PUT', route: route, body: {project_name: name}});
    return response
}

async function loadModalAction(name){
    const route = 'models?mode=actionOnly'
    let response = await apiFetch({method: 'PUT', route: route, body: {project_name: name}});
    return response
}

module.exports = {
    apiFetch: apiFetch,
    login: login,
    logout: logout,
    getProjectList: getProjectList,
    createFile: createFile,
    deleteFile: deleteFile,
    getFileList: getFileList,
    getFileData: getFileData,
    updateFile: updateFile,
    getAllFileData: getAllFileData,
    getLocalConfig: getLocalConfig,
    updateLocalConfig: updateLocalConfig,
    getBuiltinActionList: getBuiltinActionList,
    getBuiltinIntentList: getBuiltinIntentList,
    getRasaStatus: getRasaStatus,
    trainModel: trainModel,
    loadModel: loadModel,
    createProject: createProject,
    deleteProject: deleteProject,
    loadModalAction: loadModalAction,
}


